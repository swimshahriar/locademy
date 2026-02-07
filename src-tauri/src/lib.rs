use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::io::{Read, Seek, SeekFrom};
use std::path::{Path, PathBuf};
use tauri::Manager;

const VIDEO_EXTENSIONS: &[&str] = &[
    "mp4", "mkv", "webm", "avi", "mov", "wmv", "flv", "m4v", "mpg", "mpeg", "3gp", "ogv", "ts",
];

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Video {
    id: String,
    title: String,
    path: String,
    completed: bool,
    order: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Module {
    id: String,
    title: String,
    videos: Vec<Video>,
    order: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Course {
    id: String,
    title: String,
    path: String,
    modules: Vec<Module>,
    added_at: u64,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct AppData {
    courses: Vec<Course>,
}

fn data_path(app: &tauri::AppHandle) -> PathBuf {
    let dir = app.path().app_data_dir().expect("no app data dir");
    fs::create_dir_all(&dir).ok();
    dir.join("data.json")
}

fn load(app: &tauri::AppHandle) -> AppData {
    let path = data_path(app);
    fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn save(app: &tauri::AppHandle, data: &AppData) -> Result<(), String> {
    let json = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(data_path(app), json).map_err(|e| e.to_string())
}

fn is_video(path: &Path) -> bool {
    path.extension()
        .and_then(|e| e.to_str())
        .map(|e| VIDEO_EXTENSIONS.contains(&e.to_lowercase().as_str()))
        .unwrap_or(false)
}

fn sort_key(name: &str) -> (u64, String) {
    let num: String = name.chars().take_while(|c| c.is_ascii_digit()).collect();
    match num.parse::<u64>() {
        Ok(n) => (n, name.to_lowercase()),
        Err(_) => (u64::MAX, name.to_lowercase()),
    }
}

fn clean_name(name: &str) -> String {
    let s = name.trim();
    let s = if let Some(dot_pos) = s.rfind('.') {
        let ext = &s[dot_pos + 1..];
        if VIDEO_EXTENSIONS.contains(&ext.to_lowercase().as_str()) {
            &s[..dot_pos]
        } else {
            s
        }
    } else {
        s
    };

    let rest = s.trim_start_matches(|c: char| c.is_ascii_digit());
    if rest.len() == s.len() {
        return s.to_string();
    }

    let rest = rest
        .strip_prefix(" - ")
        .or_else(|| rest.strip_prefix(". "))
        .or_else(|| rest.strip_prefix("- "))
        .or_else(|| rest.strip_prefix('.'))
        .or_else(|| rest.strip_prefix('_'))
        .or_else(|| rest.strip_prefix('-'))
        .or_else(|| rest.strip_prefix(' '))
        .unwrap_or(rest);

    let cleaned = rest.trim();
    if cleaned.is_empty() {
        s.to_string()
    } else {
        cleaned.to_string()
    }
}

fn sorted_entries(dir: &Path) -> (Vec<PathBuf>, Vec<PathBuf>) {
    let Ok(entries) = fs::read_dir(dir) else {
        return (vec![], vec![]);
    };

    let mut dirs = Vec::new();
    let mut videos = Vec::new();

    for entry in entries.flatten() {
        let p = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') {
            continue;
        }
        if p.is_dir() {
            dirs.push(p);
        } else if is_video(&p) {
            videos.push(p);
        }
    }

    let sort_by_name = |a: &PathBuf, b: &PathBuf| {
        let ka = sort_key(a.file_name().unwrap_or_default().to_str().unwrap_or(""));
        let kb = sort_key(b.file_name().unwrap_or_default().to_str().unwrap_or(""));
        ka.cmp(&kb)
    };

    dirs.sort_by(sort_by_name);
    videos.sort_by(sort_by_name);
    (dirs, videos)
}

fn make_videos(paths: &[PathBuf]) -> Vec<Video> {
    paths
        .iter()
        .enumerate()
        .map(|(i, p)| {
            let fname = p
                .file_name()
                .unwrap_or_default()
                .to_str()
                .unwrap_or("Unknown");
            Video {
                id: uuid::Uuid::new_v4().to_string(),
                title: clean_name(fname),
                path: p.to_string_lossy().to_string(),
                completed: false,
                order: i as u32,
            }
        })
        .collect()
}

fn scan(path: &Path) -> Result<Vec<Module>, String> {
    let (dirs, root_videos) = sorted_entries(path);
    let mut modules = Vec::new();

    if !dirs.is_empty() {
        for (i, dir) in dirs.iter().enumerate() {
            let (_, videos) = sorted_entries(dir);
            if videos.is_empty() {
                continue;
            }
            let dir_name = dir
                .file_name()
                .unwrap_or_default()
                .to_str()
                .unwrap_or("Unknown");
            modules.push(Module {
                id: uuid::Uuid::new_v4().to_string(),
                title: clean_name(dir_name),
                videos: make_videos(&videos),
                order: i as u32,
            });
        }

        if !root_videos.is_empty() {
            modules.push(Module {
                id: uuid::Uuid::new_v4().to_string(),
                title: "Other Videos".to_string(),
                videos: make_videos(&root_videos),
                order: modules.len() as u32,
            });
        }
    } else if !root_videos.is_empty() {
        let folder_name = path
            .file_name()
            .unwrap_or_default()
            .to_str()
            .unwrap_or("Course");
        modules.push(Module {
            id: uuid::Uuid::new_v4().to_string(),
            title: folder_name.to_string(),
            videos: make_videos(&root_videos),
            order: 0,
        });
    }

    Ok(modules)
}

#[tauri::command]
fn get_courses(app: tauri::AppHandle) -> Vec<Course> {
    load(&app).courses
}

#[tauri::command]
fn add_course(app: tauri::AppHandle, path: String) -> Result<Course, String> {
    let folder = Path::new(&path);
    if !folder.is_dir() {
        return Err("Invalid folder".to_string());
    }

    let mut data = load(&app);
    if data.courses.iter().any(|c| c.path == path) {
        return Err("Course already added".to_string());
    }

    let modules = scan(folder)?;
    if modules.is_empty() {
        return Err("No video files found in this folder".to_string());
    }

    let title = folder
        .file_name()
        .unwrap_or_default()
        .to_str()
        .unwrap_or("Untitled")
        .to_string();

    let course = Course {
        id: uuid::Uuid::new_v4().to_string(),
        title,
        path,
        modules,
        added_at: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
    };

    data.courses.push(course.clone());
    save(&app, &data)?;
    Ok(course)
}

#[tauri::command]
fn remove_course(app: tauri::AppHandle, course_id: String) -> Result<(), String> {
    let mut data = load(&app);
    data.courses.retain(|c| c.id != course_id);
    save(&app, &data)
}

#[tauri::command]
fn toggle_video_complete(
    app: tauri::AppHandle,
    course_id: String,
    video_id: String,
) -> Result<bool, String> {
    let mut data = load(&app);
    let mut new_state = false;
    if let Some(course) = data.courses.iter_mut().find(|c| c.id == course_id) {
        for module in &mut course.modules {
            if let Some(video) = module.videos.iter_mut().find(|v| v.id == video_id) {
                video.completed = !video.completed;
                new_state = video.completed;
                break;
            }
        }
    }
    save(&app, &data)?;
    Ok(new_state)
}

#[tauri::command]
fn rescan_course(app: tauri::AppHandle, course_id: String) -> Result<Course, String> {
    let mut data = load(&app);
    let course = data
        .courses
        .iter_mut()
        .find(|c| c.id == course_id)
        .ok_or("Course not found")?;

    let folder = Path::new(&course.path);
    if !folder.exists() {
        return Err("Course folder no longer exists".to_string());
    }

    let completed: HashSet<String> = course
        .modules
        .iter()
        .flat_map(|m| m.videos.iter())
        .filter(|v| v.completed)
        .map(|v| v.path.clone())
        .collect();

    let mut modules = scan(folder)?;
    for module in &mut modules {
        for video in &mut module.videos {
            if completed.contains(&video.path) {
                video.completed = true;
            }
        }
    }

    course.modules = modules;
    let updated = course.clone();
    save(&app, &data)?;
    Ok(updated)
}

fn url_decode(s: &str) -> String {
    let mut out = Vec::new();
    let bytes = s.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            if let (Some(h), Some(l)) = (
                (bytes[i + 1] as char).to_digit(16),
                (bytes[i + 2] as char).to_digit(16),
            ) {
                out.push((h * 16 + l) as u8);
                i += 3;
                continue;
            }
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).to_string()
}

fn parse_range(header: &str, total: u64) -> Option<(u64, u64)> {
    let range = header.strip_prefix("bytes=")?;
    let mut parts = range.splitn(2, '-');
    let start_str = parts.next()?;
    let end_str = parts.next()?;

    if start_str.is_empty() {
        let suffix: u64 = end_str.parse().ok()?;
        let start = total.saturating_sub(suffix);
        Some((start, total - 1))
    } else {
        let start: u64 = start_str.parse().ok()?;
        let end = if end_str.is_empty() {
            total - 1
        } else {
            end_str.parse().ok()?
        };
        if start > end || start >= total {
            return None;
        }
        Some((start, std::cmp::min(end, total - 1)))
    }
}

fn video_mime(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase()
        .as_str()
    {
        "mp4" | "m4v" => "video/mp4",
        "webm" => "video/webm",
        "mkv" => "video/x-matroska",
        "avi" => "video/x-msvideo",
        "mov" => "video/quicktime",
        "wmv" => "video/x-ms-wmv",
        "flv" => "video/x-flv",
        "mpg" | "mpeg" => "video/mpeg",
        "3gp" => "video/3gpp",
        "ogv" => "video/ogg",
        "ts" => "video/mp2t",
        _ => "application/octet-stream",
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .register_uri_scheme_protocol("stream", |_app, request| {
            let raw = request.uri().path();
            let raw = raw.strip_prefix('/').unwrap_or(raw);
            let decoded = url_decode(raw);
            let file_path = PathBuf::from(&decoded);

            let Ok(mut file) = fs::File::open(&file_path) else {
                return tauri::http::Response::builder()
                    .status(404)
                    .body(Vec::new())
                    .unwrap();
            };

            let Ok(meta) = file.metadata() else {
                return tauri::http::Response::builder()
                    .status(500)
                    .body(Vec::new())
                    .unwrap();
            };

            let total = meta.len();
            let mime = video_mime(&file_path);

            let range_header = request
                .headers()
                .get("range")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("");

            if let Some((start, end)) = parse_range(range_header, total) {
                let len = end - start + 1;
                let _ = file.seek(SeekFrom::Start(start));
                let mut buf = vec![0u8; len as usize];
                let _ = file.read_exact(&mut buf);

                return tauri::http::Response::builder()
                    .status(206)
                    .header("Content-Type", mime)
                    .header("Content-Length", len.to_string())
                    .header(
                        "Content-Range",
                        format!("bytes {}-{}/{}", start, end, total),
                    )
                    .header("Accept-Ranges", "bytes")
                    .body(buf)
                    .unwrap();
            }

            let mut buf = Vec::new();
            let _ = file.read_to_end(&mut buf);

            tauri::http::Response::builder()
                .status(200)
                .header("Content-Type", mime)
                .header("Content-Length", total.to_string())
                .header("Accept-Ranges", "bytes")
                .body(buf)
                .unwrap()
        })
        .invoke_handler(tauri::generate_handler![
            get_courses,
            add_course,
            remove_course,
            toggle_video_complete,
            rescan_course,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
