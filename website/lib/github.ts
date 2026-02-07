const REPO = "swimshahriar/locademy";
const API_BASE = "https://api.github.com";

export interface RepoInfo {
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  default_branch: string;
}

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  name: string;
  html_url: string;
  assets: ReleaseAsset[];
}

export async function getRepo(): Promise<RepoInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/releases/latest`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO}/releases`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function groupAssetsByPlatform(assets: ReleaseAsset[]) {
  const mac: ReleaseAsset[] = [];
  const windows: ReleaseAsset[] = [];
  const linux: ReleaseAsset[] = [];
  for (const a of assets) {
    const name = a.name.toLowerCase();
    if (name.endsWith(".dmg") || name.endsWith(".app.tar.gz")) mac.push(a);
    else if (name.endsWith(".msi") || name.endsWith(".exe")) windows.push(a);
    else if (
      name.endsWith(".deb") ||
      name.endsWith(".appimage") ||
      name.endsWith(".rpm")
    )
      linux.push(a);
  }
  return { mac, windows, linux };
}
