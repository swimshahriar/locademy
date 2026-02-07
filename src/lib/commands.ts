import { invoke } from "@tauri-apps/api/core";
import type { Course } from "./types";

export const getCourses = () => invoke<Course[]>("get_courses");

export const addCourse = (path: string) =>
  invoke<Course>("add_course", { path });

export const removeCourse = (courseId: string) =>
  invoke<void>("remove_course", { courseId });

export const toggleVideoComplete = (courseId: string, videoId: string) =>
  invoke<boolean>("toggle_video_complete", { courseId, videoId });

export const rescanCourse = (courseId: string) =>
  invoke<Course>("rescan_course", { courseId });
