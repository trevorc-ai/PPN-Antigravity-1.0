import csv
from collections import defaultdict

schema_file = 'Supabase Snippet Arc of Care Reference Tables.csv'
rls_file = 'Supabase Snippet Arc of Care Reference Tables-2.csv'

schema = defaultdict(list)
rls_info = defaultdict(list)

# Read schema
with open(schema_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        schema[row['Table Name']].append(row)

# Read RLS info - trying to see structure
with open(rls_file, 'r', encoding='utf-8') as f:
    headers = next(csv.reader(f))
    # It might not be a standard format, let's just parse what we can
    # wait, earlier head output: "log_clinical_records,true,true,Enable insert for authenticated users only,INSERT,null,..."
    # Columns appear to be: Table Name, RLS Enabled, ? , Policy Name, Action, Roles, Definition

# Print tables
print("Tables in Schema:")
for table in schema.keys():
    print(f"- {table}")

# Print fields that are text but might violate rules:
print("\n--- Potential Violations ---")
for table, fields in schema.items():
    if "waitlist" in table and "sys_" not in table:
        print(f"[Naming] Table {table} is named specifically instead of generic.")
        
    for field in fields:
        # Check for free text that might be PHI
        if field['Field Name'] in ['first_name', 'last_name', 'email', 'name', 'notes', 'clinical_notes'] and field['Data Type'] == 'text':
            print(f"[PHI/Integrity] {table}.{field['Field Name']} is of type 'text'.")
        
        # Check for non-uuid foreign keys (heuristic: ends with _id but isn't uuid)
        if field['Field Name'].endswith('_id') and field['Data Type'] != 'uuid' and field['Field Name'] != 'id':
            print(f"[Integrity] {table}.{field['Field Name']} is '{field['Data Type']}' (expected uuid?)")

        # Check for data stored in place instead of logs? (harder to heuristics)
