---
name: prompt-engineering
description: Use this skill when asked to write, generate, or optimize a prompt, system prompt, or prompt for generative AI tools like Nano Banana, Google Veo, or Google Stitch.
---
# Prompt Engineering Skill

**Goal:** Generate highly effective, optimized prompts for other AI models and generative tools.

## Instructions (Follow Strictly)
When generating a prompt for the user, you must structure it using the following best practices:

1. **Assign a Role:** Start the generated prompt by assigning a specific character, persona, or expertise level to frame the output style (e.g., "Act as a Senior Data Scientist").
2. **Use Clear Action Verbs:** Begin tasks with direct verbs like "Create," "Analyze," "Describe," or "Extract" rather than vague conversational requests.
3. **Be Hyper-Specific:** Embed necessary background context and explicitly define the desired output format (e.g., JSON, markdown table, 3-paragraph summary).
4. **Favor Positive Instructions:** Tell the target AI what *to* do instead of what *not* to do, as positive instructions are proven to be more reliable than constraints.
5. **Include Variables:** Use placeholders like `{target_audience}` or `{image_subject}` to make the generated prompt a reusable template.
6. **Implement Few-Shot Examples:** If the prompt requires a specific pattern, include 1 to 3 "golden examples" of the desired input and output within the prompt text itself.
7. **Apply Chain of Thought (CoT):** For complex reasoning tasks, append "Let's think step by step" to force the target model to generate intermediate reasoning.