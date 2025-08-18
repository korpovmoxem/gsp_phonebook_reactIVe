import os
from pathlib import Path

OBSIDIAN_DIR = 'docs'
README_PATH = 'README.md'

def merge_markdown_files():
    obsidian_root = Path(OBSIDIAN_DIR)
    readme_content = []

    # Вспомогательная функция для рекурсивного обхода
    def process_directory(path: Path, level=1):
        """level — уровень вложенности (для формирования заголовков)"""
        if path.name.startswith('.'):
            print(f"{'   ' * (level - 1)}🚫 Игнорируем папку: {path.name}")
            return

        print(f"{'   ' * (level - 1)}📁 Папка: {path.name}")
        # Добавляем заголовок для папки
        header_level = '#' * level
        readme_content.append(f"{header_level} {path.name}\n\n")

        # Обрабатываем .md файлы в текущей папке
        files = sorted([f for f in path.glob("*.md") if not f.name.startswith('.')])
        for file in files:
            print(f"{'   ' * level}📄 Файл: {file.name}")
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Добавляем заголовок файла
            readme_content.append(f"## {file.stem}\n\n")
            readme_content.append(content + "\n\n")

        # Рекурсивно обрабатываем подпапки (без точечных)
        sub_dirs = sorted([d for d in path.iterdir() if d.is_dir() and not d.name.startswith('.')])
        for sub_dir in sub_dirs:
            process_directory(sub_dir, level + 1)

    # 1. Корневые файлы (без точечных)
    root_files = sorted([f for f in obsidian_root.glob("*.md") if not f.name.startswith('.')])

    if root_files:
        print(f"[INFO] Обрабатываю {len(root_files)} корневых файлов...")
        readme_content.append(f"# Документация\n\nРекомендуется просмотр через Obsidian\n\n")

        for file in root_files:
            print(f"📄 Корневой файл: {file.name}")
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
            readme_content.append(f"## {file.stem}\n\n")
            readme_content.append(content + "\n\n")
    else:
        print("[WARN] Нет корневых .md файлов или они начинаются с точки")

    # 2. Подпапки (рекурсивно)
    root_dirs = [d for d in obsidian_root.iterdir() if d.is_dir()]
    valid_root_dirs = [d for d in root_dirs if not d.name.startswith('.')]

    if valid_root_dirs:
        print(f"[INFO] Обрабатываю {len(valid_root_dirs)} подпапок...")

        for dir_path in sorted(valid_root_dirs):
            process_directory(dir_path, level=1)
    else:
        print("[WARN] Нет допустимых подпапок")

    # Запись в README.md
    with open(README_PATH, 'w', encoding='utf-8') as readme:
        readme.write('\n'.join(readme_content))

    print(f"[INFO] README успешно создан: {README_PATH}")

if __name__ == "__main__":
    merge_markdown_files()