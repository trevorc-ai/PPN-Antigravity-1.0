const fs = require('fs');
const file = './src/components/wellness-journey/ProtocolConfiguratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block to extract (Patient Intake)
const intakeRegex = /\{\/\* ── Step 0: Patient Intake ──[\s\S]*?(?=\{\/\* Divider \*\/)/;
const intakeMatch = content.match(intakeRegex);
if (!intakeMatch) { console.error('No intake match'); process.exit(1); }
const intakeBlock = intakeMatch[0].trim();

// The divider
const dividerRegex = /\{\/\* Divider \*\/\}[\s\S]*?(?=\{\/\* Educational Callout \*\/)/;
const dividerMatch = content.match(dividerRegex);
// The workflow UI
const workflowRegex = /\{\/\* Educational Callout \*\/\}[\s\S]*?(?=\{\/\* Footer \*\/)/;
const workflowMatch = content.match(workflowRegex);
if (!workflowMatch) { console.error('No workflow match'); process.exit(1); }
const workflowBlock = workflowMatch[0].trim();

// Construct new body
// Step 1: Workflow block (includes save default)
// Step 2: Divider
// Step 3: Intake block
const newDivider = `                    {/* Divider */}
                    <div className="flex items-center gap-4 py-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 2 — Patient Context</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>`;

const newIntakeBlock = intakeBlock.replace('Step 1 — Patient Context', 'Patient Context').replace('Step 0: Patient Intake', 'Step 2: Patient Intake');

// Footer replacement to remove the condition badge
const footerRegex = /\{\/\* Condition indicator in footer \*\/\}[\s\S]*?\{\!\condition && <div \/>\}/;

let newContent = content.replace(intakeRegex, '');
newContent = newContent.replace(dividerRegex, '');
newContent = newContent.replace(workflowRegex, '');

// We need to inject them back into the `<div className="p-6 md:p-8 space-y-8...` container
const injectPoint = '                {/* Body */}\n                <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[85vh] custom-scrollbar">';
newContent = newContent.replace(injectPoint, `${injectPoint}\n\n                    ${workflowBlock}\n\n${newDivider}\n\n                    ${newIntakeBlock}\n`);

newContent = newContent.replace(footerRegex, '{/* Removed condition indicator */}');
// Center the button if removing condition? Actually just make the footer flex justify-end
newContent = newContent.replace('<div className="flex justify-between items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">', '<div className="flex justify-end items-center gap-3 px-6 py-5 border-t border-slate-800/60 bg-slate-900/40">');

fs.writeFileSync(file, newContent);
console.log('Fixed');
