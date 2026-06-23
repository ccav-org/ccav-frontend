#!/bin/bash
# 每次 build 后自动存档 dist/ 并打 git tag
# 存档在 archive/ 目录，tag 格式 v{date}-{简短描述}

ARCHIVE_DIR="$(dirname "$0")/../archive"
DIST_DIR="$(dirname "$0")/../dist"
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')

if [ ! -d "$DIST_DIR" ]; then
  echo "[archive] ⚠️ dist/ 不存在，跳过存档"
  exit 0
fi

# 把 tag 名和版本信息写到一个文件里，方便回溯
VERSION_LABEL="v$TIMESTAMP"
ARCHIVE_NAME="release-$VERSION_LABEL"
ARCHIVE_PATH="$ARCHIVE_DIR/$ARCHIVE_NAME"

# 如果同名目录已存在，加序号
COUNTER=1
while [ -d "$ARCHIVE_PATH" ]; do
  ARCHIVE_NAME="release-${VERSION_LABEL}-$COUNTER"
  ARCHIVE_PATH="$ARCHIVE_DIR/$ARCHIVE_NAME"
  COUNTER=$((COUNTER + 1))
done

# 复制存档
cp -r "$DIST_DIR" "$ARCHIVE_PATH"

# 估算大小
SIZE=$(du -sh "$ARCHIVE_PATH" | cut -f1)

# git tag
cd "$(dirname "$0")/.."
TAG_NAME="build/$VERSION_LABEL"
git tag -a "$TAG_NAME" -m "Build: $VERSION_LABEL ($SIZE)" 2>/dev/null

echo "[archive] ✅ 已存档: $ARCHIVE_NAME ($SIZE)"
echo "[archive] 🏷️  git tag: $TAG_NAME"
