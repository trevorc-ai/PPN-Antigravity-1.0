import csv
from collections import defaultdict

rls_file = 'Supabase Snippet Arc of Care Reference Tables-2.csv'
rls_info = defaultdict(list)

try:
    with open(rls_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        for row in reader:
            if row:
                table = row[0]
                rls_enabled = row[1] if len(row) > 1 else 'false'
                rls_info[table].append(rls_enabled)

    print("--- RLS Audit ---")
    for table, statuses in rls_info.items():
        if 'false' in [s.lower() for s in statuses]:
            print(f"[RLS Violation] {table} has RLS disabled.")
        elif not statuses:
            print(f"[RLS Missing] {table} has no RLS policies listed.")
        else:
            print(f"[RLS OK] {table} (Checked {len(statuses)} rows)")
except Exception as e:
    print("Error reading RLS file:", e)
