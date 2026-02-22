import os
import re

dir_path = '.'
exclude_dirs = {'.git', 'node_modules', 'dist', 'venv', '.next'}
success_count = 0

for root, dirs, files in os.walk(dir_path):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz')):
            continue
        filepath = os.path.join(root, file)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue
            
        original_content = content
        
        # Replace info@ -> info@
        content = re.sub(r'info@', 'info@', content, flags=re.IGNORECASE)
        
        # Replace PPN Admin
        content = re.sub(r'\bTrevor Calton\b', 'PPN Admin', content, flags=re.IGNORECASE)
        
        # Replace occurrences of Admin (whole word) with Admin
        content = re.sub(r'\bTrevor\b', 'Admin', content)
        content = re.sub(r'\btrevor\b', 'admin', content)
        
        if content != original_content:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                success_count += 1
                print(f"Updated: {filepath}")
            except Exception as e:
                print(f"Failed to write {filepath}: {e}")

print(f"Total files updated: {success_count}")
