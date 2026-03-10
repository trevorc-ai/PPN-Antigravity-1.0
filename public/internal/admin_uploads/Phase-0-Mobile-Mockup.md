<!-- New Patient Setup Form -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>New Patient Setup</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style data-purpose="custom-styles">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #0B0E14; /* Deep dark background */
      /* Simulate the blurred colorful background */
      background-image: 
        radial-gradient(circle at 10% 30%, rgba(30, 100, 200, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 80% 60%, rgba(120, 50, 180, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 90%, rgba(40, 120, 200, 0.15) 0%, transparent 50%);
      background-attachment: fixed;
      color: white;
      -webkit-font-smoothing: antialiased;
    }

    /* Glassmorphism base for elements */
    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Selected state for pills/segments with cyan glow */
    .glow-cyan {
      background: #3B82F6; /* Tailwind blue-500 equivalent, adjust if needed */
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.5), inset 0 1px 1px rgba(255,255,255,0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Specific gradients for different elements based on mockup */
    .chip-selected {
      background: linear-gradient(180deg, #4FA4F2 0%, #3B82F6 100%);
      box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .segment-selected {
       background: linear-gradient(180deg, #4FA4F2 0%, #3B82F6 100%);
       box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    }

    .bottom-btn-gradient {
      background: linear-gradient(90deg, #38BDF8 0%, #818CF8 50%, #A855F7 100%);
      box-shadow: 0 0 20px rgba(129, 140, 248, 0.4);
      border: 1px solid rgba(255,255,255,0.2);
    }

    /* Segmented Control specific styles */
    .segmented-control {
      display: flex;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      padding: 2px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .segmented-control > div {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      font-size: 0.875rem; /* text-sm */
      color: #9CA3AF; /* gray-400 */
      position: relative;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 9999px;
    }
    
    /* Dividers between segments */
    .segmented-control > div:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }
    .segmented-control > .segment-selected::after,
    .segmented-control > .segment-selected + div::after {
        display: none; /* Hide dividers around selected item */
    }

    /* Hide scrollbar for mobile */
    ::-webkit-scrollbar {
      display: none;
    }
  </style>
<style>.chip-selected { color: #ffffff !important; } .chip-selected svg { color: #ffffff !important; }</style><style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="min-h-screen flex justify-center pb-24" style="background: radial-gradient(circle at 20% 30%, rgba(35, 115, 150, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 50, 150, 0.2) 0%, transparent 50%), #0d1117 !important; background-attachment: fixed !important;">
<main class="w-full max-w-md px-6 pt-12 flex flex-col gap-8 relative">
<!-- BEGIN: Header Section -->
<header class="flex justify-between items-start">
<div>
<p class="text-gray-400 text-sm font-medium mb-1">Step 1 of 5</p>
<h1 class="text-3xl font-bold tracking-tight">New Patient Setup</h1>
</div>
<button class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</button>
</header>
<!-- END: Header Section -->
<!-- BEGIN: Treating Section -->
<section>
<h2 class="text-lg font-medium mb-4">What are you treating?</h2>
<div class="flex flex-wrap gap-3">
<!-- Selected Chips -->
<div class="chip-selected text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer">
<svg class="h-4 w-4" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
</svg>
          PTSD
        </div>
<div class="chip-selected text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer">
<svg class="h-4 w-4" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
</svg>
          Depression
        </div>
<div class="chip-selected text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer">
<svg class="h-4 w-4" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
</svg>
          Anxiety / GAD
        </div>
<div class="chip-selected text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer">
<svg class="h-4 w-4" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
</svg>
          Addiction / SUD
        </div>
<!-- Unselected Chip -->
<div class="glass-panel text-gray-300 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors">
          End-of-Life Distress
        </div>
<div class="glass-panel text-gray-300 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors">
          Spiritual / Ceremonial
        </div>
<!-- Selected Chip -->
<div class="chip-selected text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer">
<svg class="h-4 w-4" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
</svg>
          Chronic Pain
        </div>
<!-- Unselected Chip -->
<div class="glass-panel text-gray-300 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-white/10 transition-colors">
          Other
        </div>
</div>
</section>
<!-- END: Treating Section -->
<!-- Subtle Divider -->
<hr class="border-gray-800"/>
<!-- BEGIN: Gender Section -->
<section>
<h2 class="text-lg font-medium mb-4">Gender</h2>
<div class="segmented-control">
<div class="segment-selected text-white font-medium">Male</div>
<div>Female</div>
<div>Non-binary</div>
</div>
</section>
<!-- END: Gender Section -->
<!-- BEGIN: Smoking Status Section -->
<section>
<h2 class="text-lg font-medium mb-4">Smoking Status</h2>
<div class="segmented-control">
<div class="segment-selected text-white font-medium">Non-smoker</div>
<div>Ex-smoker</div>
<div>Current smoker</div>
<div class="text-xs flex items-center justify-center">Prefer not to say</div>
</div>
</section>
<!-- END: Smoking Status Section -->
<!-- BEGIN: Metrics Section -->
<section class="flex gap-4" style="margin-bottom: 30px;">
<!-- Age Card -->
<div class="glass-panel rounded-2xl p-5 flex-1 flex flex-col items-center justify-between" style="min-height: 180px; padding: 24px 16px; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
<span class="text-white text-lg font-medium mb-4">Age</span>
<div class="flex items-center justify-center gap-6 w-full mb-4" style="display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%;">
<button class="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors" style="width: 48px; height: 48px; flex-shrink: 0;">
+
</button>
<span class="text-[54px] font-medium leading-none text-white" style="font-size: 54px; line-height: 1; margin: 0; padding: 0;">55</span>
<button class="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors" style="width: 48px; height: 48px; flex-shrink: 0;">
-
</button>
</div>
<span class="text-gray-400 text-sm mt-auto" style="color: #999; font-size: 14px; margin-top: auto;">Years</span>
</div>
<!-- Weight Card -->
<div class="glass-panel rounded-2xl p-5 flex-1 flex flex-col items-center justify-between" style="min-height: 180px; padding: 24px 16px; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
<span class="text-white text-lg font-medium mb-2">Weight (kg)</span>
<div class="bg-white/5 border border-white/5 rounded-xl py-2 px-6 flex items-baseline justify-center gap-2 my-4 mx-auto w-[85%]" style="padding: 12px 24px; border-radius: 12px; margin-bottom: 12px; display: flex; align-items: baseline;">
<span class="text-[48px] font-medium leading-none text-white" style="font-size: 48px; line-height: 1; margin: 0;">100</span>
<span class="text-gray-400 text-lg" style="font-size: 18px; margin-left: 8px;">kg</span>
</div>
<span class="text-gray-400 text-sm mt-auto" style="color: #999; font-size: 14px; margin-top: auto;">≈ 220.5 lbs</span>
</div>
</section>
<!-- END: Metrics Section -->
<!-- BEGIN: Fixed Bottom Button -->
<div class="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14] to-transparent pointer-events-none flex justify-center">
<button class="bottom-btn-gradient w-full max-w-md rounded-full py-4 px-6 flex items-center justify-center gap-3 pointer-events-auto transition-transform active:scale-[0.98]">
<svg class="h-5 w-5 text-white/70" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fill-rule="evenodd"></path>
</svg>
<span class="text-white/90 font-semibold text-lg">Start Session</span>
<svg class="h-5 w-5 text-white/70" fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</button>
</div>
<!-- END: Fixed Bottom Button -->
</main>
</body></html>

<!-- Workspace Configuration Sheet -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Workspace Configuration</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- FontAwesome -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<style data-purpose="custom-styles">
        body {
            font-family: 'Inter', sans-serif;
            /* Placeholder background to simulate the context */
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            min-height: 100vh;
            display: flex;
            align-items: flex-end; /* Align modal to bottom for mobile feel */
            justify-content: center;
        }

        .glass-modal {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-bottom-bar {
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .custom-checkbox {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid #4B5563; /* tailwind gray-600 */
            background-color: transparent;
            display: grid;
            place-content: center;
            cursor: pointer;
        }

        .custom-checkbox::before {
            content: "\f00c"; /* FontAwesome check */
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            color: white;
            font-size: 12px;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
        }

        .custom-checkbox:checked {
            background-color: #3B82F6; /* tailwind blue-500 */
            border-color: #3B82F6;
        }

        .custom-checkbox:checked::before {
            transform: scale(1);
        }

        .glow-card {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
            border: 1px solid #3B82F6;
            background: linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0.5) 100%);
        }

        .icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
<!-- BEGIN: MainModal -->
<main class="glass-modal w-full max-w-md h-[95vh] rounded-t-3xl flex flex-col relative overflow-hidden text-sm sm:text-base bg-white/5 backdrop-blur-xl border border-white/10">
<!-- Drag Handle Indicator -->
<div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-500 rounded-full"></div>
<!-- BEGIN: HeaderSection -->
<header class="flex items-center justify-between px-4 pt-6 pb-4">
<!-- Back Button -->
<button aria-label="Go back" class="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:bg-gray-600/50 transition">
<i class="fa-solid fa-arrow-left text-sm"></i>
</button>
<!-- Title & Subtitle -->
<div class="text-center flex-1 px-2">
<h1 class="text-lg font-bold tracking-wide">Workspace Configuration</h1>
<p class="text-xs text-gray-400 mt-0.5">Configure your clinical interface layout.</p>
</div>
<!-- Close Button -->
<button aria-label="Close" class="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 hover:bg-gray-600/50 transition">
<i class="fa-solid fa-times text-sm"></i>
</button>
</header>
<!-- END: HeaderSection -->
<!-- BEGIN: ScrollableContent -->
<div class="flex-1 overflow-y-auto px-4 pb-32">
<!-- Choose Workspace Info -->
<section class="mb-5">
<h2 class="flex items-center text-base font-semibold mb-2">
<i class="fas fa-info-circle text-gray-300 mr-2 text-lg"></i>
                    Choose Your Workspace
                </h2>
<p class="text-gray-300 text-sm leading-relaxed">
                    Select the tools you actually use to keep your interface clean and fast. Please don't over-select "just in case", you can change these settings at any time!
                </p>
</section>
<!-- Custom Framework Card -->
<section class="glow-card rounded-2xl p-4 mb-5 relative shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400">
<!-- Checkmark Badge -->
<div class="absolute top-4 right-4 text-blue-400 text-xl">
<i class="fa-solid fa-circle-check bg-white rounded-full leading-none"></i>
</div>
<div class="flex items-start mb-3">
<div class="icon-box bg-blue-500/20 text-blue-400 mr-3 border border-blue-500/30">
<i class="fa-solid fa-sliders text-sm"></i>
</div>
<div class="pr-6">
<h3 class="font-bold text-base mb-1">Custom Framework</h3>
<p class="text-gray-300 text-xs leading-snug">
                            Build your own workflow. Hand-pick features across clinical and subjective domains.
                        </p>
</div>
</div>
<div class="mt-3">
<h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Included Modules:</h4>
<div class="flex flex-wrap text-xs text-gray-300 gap-y-1 gap-x-3">
<div class="flex items-center"><span class="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span> Hand-picked modules</div>
<div class="flex items-center"><span class="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span> Cross-domain flexibility</div>
<div class="flex items-center"><span class="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span> Cross-domain flexibility</div>
<!-- Badge -->
<div class="bg-amber-900/50 text-amber-500 border border-amber-600/50 px-2 py-0.5 rounded-md font-semibold text-[10px] ml-auto">
                            15 features selected
                        </div>
</div>
</div>
</section>
<!-- Module List -->
<section class="bg-gray-800/40 rounded-2xl border border-gray-700/50 overflow-hidden">
<!-- List Item 1 -->
<div class="flex items-center justify-between p-3.5 border-b border-gray-700/50">
<div class="flex items-center">
<input checked="" class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-blue-500/20 text-blue-400 mr-3">
<i class="fa-solid fa-heart-pulse text-sm"></i>
</div>
<span class="text-gray-100 font-medium text-sm">Clinical Baselines (PHQ-9)</span>
</div>
<i class="fa-solid fa-chevron-down text-gray-500 text-xs"></i>
</div>
<!-- List Item 2 -->
<div class="flex items-center justify-between p-3.5 border-b border-gray-700/50">
<div class="flex items-center">
<input checked="" class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-blue-500/20 text-blue-400 mr-3">
<i class="fa-solid fa-heart-pulse text-sm"></i>
</div>
<span class="text-gray-100 font-medium text-sm">Vital Sign Tracking</span>
</div>
<i class="fa-solid fa-chevron-down text-gray-500 text-xs"></i>
</div>
<!-- List Item 3 -->
<div class="flex items-center justify-between p-3.5 border-b border-gray-700/50">
<div class="flex items-center">
<input class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-yellow-500/20 text-yellow-500 mr-3">
<i class="fa-solid fa-file-lines text-sm"></i>
</div>
<span class="text-gray-300 font-medium text-sm">Narrative Timeline Logging</span>
</div>
</div>
<!-- List Item 4 -->
<div class="flex items-center justify-between p-3.5 border-b border-gray-700/50">
<div class="flex items-center">
<input class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-gray-600/30 text-gray-400 mr-3">
<i class="fa-solid fa-pen-to-square text-sm"></i>
</div>
<span class="text-gray-300 font-medium text-sm">Integration Worksheets</span>
</div>
</div>
<!-- List Item 5 -->
<div class="flex items-center justify-between p-3.5 border-b border-gray-700/50">
<div class="flex items-center">
<input checked="" class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-blue-500/20 text-blue-400 mr-3">
<i class="fa-solid fa-bolt text-sm"></i>
</div>
<span class="text-gray-100 font-medium text-sm">Automated Risk Engine</span>
</div>
<i class="fa-solid fa-chevron-down text-gray-500 text-xs"></i>
</div>
<!-- List Item 6 -->
<div class="flex items-center justify-between p-3.5">
<div class="flex items-center">
<input class="custom-checkbox mr-3" type="checkbox"/>
<div class="icon-box bg-gray-600/30 text-gray-400 mr-3">
<i class="fa-solid fa-list-ul text-sm"></i>
</div>
<span class="text-gray-300 font-medium text-sm">Custom Field</span>
</div>
</div>
</section>
</div>
<!-- END: ScrollableContent -->
<!-- BEGIN: BottomBar -->
<div class="glass-bottom-bar absolute bottom-0 left-0 w-full p-4 rounded-t-2xl sm:rounded-none z-10 bg-gray-900/90 backdrop-blur border-t border-gray-800">
<div class="flex items-center mb-4 px-1">
<input class="appearance-none w-5 h-5 rounded border border-gray-600 bg-white/10 flex-shrink-0 mr-3 custom-checkbox" id="save-default" style="border-radius: 6px;" type="checkbox"/>
<label class="text-gray-300 text-xs cursor-pointer" for="save-default">Save this as my global default for all future sessions.</label>
</div>
<button class="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center">
<span class="mr-2 text-base">Start Session</span>
<i class="fa-solid fa-arrow-right text-sm"></i>
</button>
</div>
<!-- END: BottomBar -->
</main>
<!-- END: MainModal -->
</body></html>

<!-- Workspace Configuration Sheet -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Workspace Configuration</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<style data-purpose="custom-styles">
    body {
      background-color: #0b1120;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: white;
    }
    .glass-panel {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .selected-card {
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid #38bdf8;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
    }
    .unselected-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .gradient-button {
      background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
    }
    .checkbox-custom {
      appearance: none;
      background-color: transparent;
      margin: 0;
      font: inherit;
      color: currentColor;
      width: 1.25em;
      height: 1.25em;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.25em;
      display: grid;
      place-content: center;
    }
    .checkbox-custom::before {
      content: "";
      width: 0.65em;
      height: 0.65em;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em white;
      background-color: CanvasText;
      transform-origin: bottom left;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }
    .checkbox-custom:checked::before {
      transform: scale(1);
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="flex items-center justify-center min-h-screen relative p-4 bg-cover bg-center">
<!-- BEGIN: MainOverlay -->
<div class="absolute inset-0 bg-black/50 z-0"></div>
<!-- END: MainOverlay -->
<!-- BEGIN: ModalSheet -->
<main class="glass-panel w-full max-w-md rounded-3xl flex flex-col z-10 overflow-hidden shadow-2xl relative h-[90vh]">
<!-- BEGIN: ModalHeader -->
<header class="pt-6 pb-4 px-6 relative flex flex-col items-center border-b border-white/10">
<!-- Drag Handle -->
<div class="w-12 h-1 bg-white/20 rounded-full mb-4 absolute top-3"></div>
<!-- Top Row: Back, Title, Close -->
<div class="flex w-full items-center justify-between mb-1 mt-2">
<button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
</button>
<h1 class="text-xl font-bold text-center flex-1 mx-2 text-white shadow-sm">Workspace Configuration</h1>
<button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
</button>
</div>
<!-- Subtitle -->
<p class="text-sm text-gray-300 text-center mt-1">Configure your clinical interface layout.</p>
</header>
<!-- END: ModalHeader -->
<!-- BEGIN: ModalContent -->
<section class="flex-1 overflow-y-auto px-6 py-5 pb-52 scrollbar-hide">
<!-- Info Section -->
<div class="mb-6">
<h2 class="text-lg font-semibold flex items-center gap-2 mb-2">
<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          Choose Your Workspace
        </h2>
<p class="text-sm text-gray-300 leading-relaxed">
          Select the tools you actually use to keep your interface clean and fast. Please don't over-select "just in case", you can change these settings at any time!
        </p>
</div>
<!-- Options List -->
<div class="space-y-4">
<!-- Option 1: Clinical Protocol (Selected) -->
<div class="selected-card rounded-2xl p-4 relative cursor-pointer group transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)]">
<div class="absolute top-4 right-4 text-blue-400">
<svg class="w-6 h-6" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill-rule="evenodd"></path></svg>
</div>
<div class="flex items-start gap-4 mb-3">
<div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 text-blue-400">
<svg class="w-7 h-7" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
</div>
<div>
<h3 class="font-bold text-lg mb-0.5">Clinical Protocol</h3>
<p class="text-xs text-gray-300 leading-snug"><span class="font-semibold text-white">Active Modules:</span> 3 (Clinical Baselines, Vitals, Risk Engine)</p>
</div>
</div>
<div class="space-y-2 mt-3 text-sm">
<p><span class="font-semibold">Risk Assessment Score:</span> 8.5/10 <span class="text-gray-400">(High)</span></p>
<p class="text-gray-300">Strict medical tracking.</p>
</div>
</div>
<!-- Option 2: Ceremonial / Wellness -->
<div class="unselected-card rounded-2xl p-4 relative cursor-pointer hover:bg-white/10 transition-all">
<div class="flex items-start gap-4 mb-3">
<div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30 text-amber-400">
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
</div>
<div>
<h3 class="font-bold text-lg mb-0.5 text-white/90">Ceremonial / Wellness</h3>
<p class="text-xs text-gray-400 leading-snug"><span class="font-semibold text-gray-300">Active Modules:</span> 3 (Narrative, MEQ-30, Integration)</p>
</div>
</div>
<div class="space-y-2 mt-3 text-sm">
<p class="text-gray-300"><span class="font-semibold">Risk Assessment Score:</span> 2.0/10 <span class="text-gray-500">(Low)</span></p>
<p class="text-gray-400">Lightweight flow.</p>
</div>
</div>
<!-- Option 3: Custom Framework -->
<div class="unselected-card rounded-2xl p-4 relative cursor-pointer hover:bg-white/10 transition-all">
<div class="flex items-start gap-4 mb-3">
<div class="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center shrink-0 border border-gray-500/30 text-gray-400">
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
</div>
<div class="flex-1">
<div class="flex items-center gap-2 mb-0.5">
<h3 class="font-bold text-lg text-white/90">Custom Framework</h3>
<span class="text-[10px] font-bold uppercase tracking-wider bg-amber-600/30 text-amber-500 px-2 py-0.5 rounded-full border border-amber-600/50">15 features selected</span>
</div>
<p class="text-xs text-gray-400 leading-snug"><span class="font-semibold text-gray-300">Active Modules:</span> 15 (Various domains)</p>
</div>
</div>
<div class="space-y-2 mt-3 text-sm">
<p class="text-gray-300"><span class="font-semibold">Risk Assessment Score:</span> N/A</p>
<p class="text-gray-400">Build your own workflow.</p>
</div>
</div>
</div>
</section>
<!-- END: ModalContent -->
<!-- BEGIN: ModalFooter -->
<footer class="absolute bottom-0 w-full bg-slate-800/80 backdrop-blur-md border-t border-white/10 pb-8 pt-4 px-6 rounded-b-3xl">
<div class="flex items-center gap-3 mb-4">
<input class="checkbox-custom rounded border-gray-500 bg-white/5 focus:ring-0 focus:ring-offset-0 cursor-pointer" id="saveGlobal" type="checkbox"/>
<label class="text-sm text-gray-300 cursor-pointer select-none" for="saveGlobal">Save this as my global default for all future sessions.</label>
</div>
<button class="w-full gradient-button text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">Start Session →</button>
</footer>
<!-- END: ModalFooter -->
</main>
<!-- END: ModalSheet -->
</body></html>

<!-- Start Wellness Session -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Start a Wellness Session</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/>
<style data-purpose="custom-styles">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #0b1320;
      background-image: radial-gradient(circle at 50% 30%, #1a365d 0%, #0b1320 60%);
      color: white;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
    }

    .app-container {
      width: 100%;
      max-width: 414px;
      height: 100vh;
      max-height: 896px;
      background: rgba(11, 19, 32, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 40px 40px 0 0;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Modal Handle */
    .modal-handle {
      width: 40px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      margin: 16px auto;
    }

    /* Header Divider */
    .header-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 50%, transparent);
      margin-bottom: 24px;
    }

    /* Glass Cards */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;
    }

    .glass-card.active {
      background: rgba(37, 99, 235, 0.1);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.2), inset 0 0 10px rgba(59, 130, 246, 0.1);
    }

    .glass-card.disabled {
      opacity: 0.5;
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.05);
    }

    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      margin-right: 16px;
    }

    .active .icon-box {
      background: rgba(30, 58, 138, 0.5);
      color: #93c5fd;
    }

    .disabled .icon-box {
      background: rgba(255, 255, 255, 0.05);
      color: #9ca3af;
    }

    /* Primary Buttons */
    .btn-primary {
      background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
      border: 1px solid rgba(96, 165, 250, 0.5);
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .btn-secondary {
      background: linear-gradient(180deg, #2dd4bf 0%, #0f766e 100%);
      border: 1px solid rgba(45, 212, 191, 0.5);
      box-shadow: 0 4px 14px rgba(15, 118, 110, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border-radius: 30px;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /* Practice Session Elements */
    .practice-btn {
      border: 1px solid rgba(245, 158, 11, 0.5);
      background: rgba(245, 158, 11, 0.1);
      color: #fcd34d;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: underline;
      text-decoration-color: rgba(252, 211, 77, 0.5);
      text-underline-offset: 4px;
    }

    .tooltip {
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(245, 158, 11, 0.3);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.4;
      color: #f8fafc;
      position: absolute;
      bottom: calc(100% + 12px);
      right: 0;
      width: 260px;
      text-align: center;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 40px;
      border-width: 8px;
      border-style: solid;
      border-color: rgba(30, 41, 59, 0.95) transparent transparent transparent;
      filter: drop-shadow(0 2px 2px rgba(245, 158, 11, 0.2));
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body>
<!-- BEGIN: Main App Container -->
<div class="app-container pt-2 px-6 pb-8 relative">
<!-- BEGIN: Header -->
<div class="modal-handle"></div>
<div class="text-center mb-6 mt-2"><h1 class="text-4xl font-bold tracking-tight mb-2">Start a Wellness Session</h1>
<p class="text-gray-400 text-xl">Select a patient context.</p></div>
<div class="header-divider"></div>
<!-- END: Header -->
<!-- BEGIN: Content Options -->
<div class="flex-1 flex flex-col gap-4">
<!-- Existing Patient Card -->
<button class="glass-card active w-full text-left focus:outline-none"><div class="icon-box bg-blue-900/50 rounded-2xl w-14 h-14 flex items-center justify-center mr-4">
<i class="fas fa-search text-2xl text-blue-200"></i>
</div>
<div class="flex-1">
<h2 class="text-2xl font-semibold">Existing Patient</h2>
</div>
<i class="fas fa-chevron-right text-gray-400 text-xl"></i></button>
<!-- Most Recent Card (Disabled) -->
<button class="glass-card disabled w-full text-left focus:outline-none cursor-not-allowed"><div class="icon-box bg-white/5 rounded-2xl w-14 h-14 flex items-center justify-center mr-4">
<i class="far fa-clock text-2xl text-gray-500"></i>
</div>
<div class="flex-1">
<h2 class="text-2xl font-semibold text-gray-500">Most Recent</h2>
<p class="text-gray-600 text-lg">No prior sessions</p>
</div></button>
</div>
<!-- END: Content Options -->
<!-- BEGIN: Bottom Actions -->
<div class="mt-auto pt-6 flex flex-col gap-4">
<button class="btn-primary w-full text-xl py-5">
        New Patient
        <i class="fas fa-chevron-right absolute right-6"></i>
</button>
<div class="relative flex flex-col items-end">
<button class="btn-secondary w-full text-xl py-5 gap-3">
<i class="fas fa-camera text-2xl"></i>
        Scan Patient
      </button>
<div class="mt-4 relative">
<div class="tooltip z-10 w-[180px] absolute bottom-full right-0 mb-3 border border-orange-500/60 shadow-[0_0_10px_rgba(255,165,0,0.3)]">
            Practice mode records no data to the patient chart and is for training purposes only.
          </div>
<button class="practice-btn mt-2">
<i class="fas fa-flask"></i>
            Practice Session
          </button>
</div>
</div>
</div>
<!-- END: Bottom Actions -->
</div>
<!-- END: Main App Container -->
</body></html>