"""
Upload hf-backend/ to a free Hugging Face Space (Docker).

Usage (PowerShell):
  $env:HF_TOKEN = "hf_..."   # from https://huggingface.co/settings/tokens
  python scripts/deploy_hf.py

Optional:
  $env:HF_USERNAME = "your-username"
  $env:HF_SPACE = "youtubeclone-api"
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from huggingface_hub import HfApi, create_repo, whoami


ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "hf-backend"


def main() -> int:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_HUB_TOKEN")
    if not token:
        print("Missing HF_TOKEN. Create one at https://huggingface.co/settings/tokens")
        print("Then:  $env:HF_TOKEN='hf_...' ; python scripts/deploy_hf.py")
        return 1

    if not BACKEND.exists():
        print(f"Missing folder: {BACKEND}")
        return 1

    api = HfApi(token=token)
    info = whoami(token=token)
    username = os.environ.get("HF_USERNAME") or info.get("name")
    space = os.environ.get("HF_SPACE") or "youtubeclone-api"
    repo_id = f"{username}/{space}"

    print(f"Logged in as: {username}")
    print(f"Creating/updating Space: {repo_id}")

    create_repo(
        repo_id=repo_id,
        repo_type="space",
        space_sdk="docker",
        exist_ok=True,
        token=token,
        private=False,
    )

    api.upload_folder(
        folder_path=str(BACKEND),
        repo_id=repo_id,
        repo_type="space",
        token=token,
        commit_message="Deploy YouTubeClone Django API to Hugging Face Spaces",
    )

    url = f"https://huggingface.co/spaces/{repo_id}"
    api_base = f"https://{username}-{space}.hf.space/api"
    print("\nSpace URL:", url)
    print("API base (for Vercel REACT_APP_API_URL):", api_base)
    print("Health check:", f"https://{username}-{space}.hf.space/health/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
