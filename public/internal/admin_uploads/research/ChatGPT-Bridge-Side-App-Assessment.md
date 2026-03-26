# **Bridge Side-App Assessment 📈**

Concise answer:  
Do not treat PPN Bridge as a simple “local-only” workaround. A checkbox is not enough. If Bridge is part of the practitioner product you provide and it stores identifiable patient data as part of that workflow, you may still create HIPAA, contract, consumer-protection, and state-law exposure even if the data never touches your servers. HHS draws a sharp line between an app acting for the consumer and an app provided by or on behalf of the covered entity. Your fact pattern is much closer to the second category, not the first. ([HHS.gov](https://www.hhs.gov/sites/default/files/ocr-health-app-developer-scenarios-2-2016.pdf))  
My recommendation is simple: keep Bridge out of the trade show story, do not launch it until specialist counsel reviews it, and do not let it contaminate the clean “de-identified core registry” story you have for PPN Portal. The core product and Bridge are not the same legal product.

## **My blunt assessment**

You are right that candidly disclosing one unresolved field like `session_date` can increase credibility.  
But PPN Bridge is different. It is not a minor edge feature. It is the feature most likely to punch a hole in your clean zero-identity positioning.  
Why? Because HHS guidance says an app that is not provided by or on behalf of the covered entity can fall outside HIPAA business-associate treatment, but an app that is developed for, provided by, or used on behalf of the covered entity to create, receive, maintain, or transmit ePHI can create HIPAA liability and BA obligations. That is true even when the vendor’s relationship to the data is more limited than founders want to believe. HHS also says that an entity maintaining encrypted ePHI on behalf of a covered entity can still be a business associate even without the decryption key. ([HHS.gov](https://www.hhs.gov/sites/default/files/ocr-health-app-developer-scenarios-2-2016.pdf))  
That means your current assumption, “it stays in IndexedDB, so we are out,” is too optimistic.

## **1\. Does browser-local storage of PHI create HIPAA liability for you?**

Yes, potentially.  
Not automatically, but potentially enough that you should assume legal review is required before launch.  
Here is the core distinction from HHS:  
When an app is acting for the individual at the individual’s request, that alone does not make the app developer a business associate. But when the app is developed for, provided by, or used on behalf of the covered entity to create, receive, maintain, or transmit ePHI, the covered entity can have HIPAA liability and a business associate relationship may exist. ([HHS.gov](https://www.hhs.gov/sites/default/files/ocr-health-app-developer-scenarios-2-2016.pdf))  
Your fact pattern is not a consumer choosing a third-party app on their own.  
Your fact pattern is:

1. practitioner-facing product,  
2. sold into a clinical workflow,  
3. storing real patient names and contact information,  
4. in a feature you designed,  
5. inside the same application experience.

That is much closer to “provided by or on behalf of the covered entity” than to a consumer-directed app. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access-right-health-apps-apis/index.html))  
Also, do not overread “we never see the data.” HHS’s cloud guidance is explicit that an entity can still be a business associate when it maintains ePHI on behalf of a covered entity even if it cannot actually view the data. That guidance is not a perfect one-to-one match for IndexedDB, but it destroys the simplistic idea that lack of plaintext access automatically gets you out of HIPAA. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html))  
My working conclusion:  
If Bridge is part of the contracted practitioner platform, assume it is in the HIPAA risk path until specialist counsel tells you otherwise.

## **2\. Will a one-time checkbox eliminate liability?**

No.  
It helps with notice. It helps with allocation of responsibility. It does not eliminate statutory duties, negligence exposure, deceptive-practice risk, or liability for your own design choices.  
The legal test is not “did the user click a box.”  
The legal test is “what function are you providing, on whose behalf, and what data does it create, receive, maintain, or transmit?” ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html))  
So your checkbox should not try to say:  
“PPN has no liability.”  
That is too aggressive and not credible.  
It should say:

1. this data is stored locally on this device only,  
2. PPN does not back it up or recover it,  
3. the practitioner is responsible for device security, backups, and compliance,  
4. local storage creates theft, loss, malware, shared-device, and unauthorized-access risk,  
5. the practitioner should enable the feature only on an organization-approved, access-controlled device,  
6. the practitioner remains responsible for HIPAA, Part 2, state law, and professional confidentiality duties applicable to their practice.

That is notice language.  
It is not magic immunity.

## **3\. What should the acknowledgment say?**

Do not call it “consent.”  
Call it:  
Local PHI Storage Acknowledgment and Device Responsibility Notice  
That is more accurate. The practitioner is not consenting to treatment. They are acknowledging a storage model and taking responsibility for it.  
Here is the language I would use as a starting point:  
By enabling PPN Bridge, you acknowledge and agree that:

1. Any patient names, phone numbers, email addresses, or other identifying contact information entered into or displayed through PPN Bridge are stored locally in this browser on this device and are not intended to be transmitted to or backed up by PPN’s servers.  
2. PPN does not provide recovery, restoration, or backup of locally stored Bridge data.  
3. You are solely responsible for determining whether your use of PPN Bridge complies with HIPAA, 42 CFR Part 2, applicable state privacy laws, licensing rules, employer policies, and your own professional confidentiality obligations.  
4. You are solely responsible for the security of the device, browser profile, operating system account, passwords, encryption settings, physical access controls, and any local backup or synchronization settings associated with this device.  
5. Loss, theft, compromise, malware, unauthorized access, shared-device use, browser synchronization, or insecure local backups may expose locally stored Bridge data.  
6. You will enable PPN Bridge only on a device and browser environment that you are authorized to use for identifiable patient information and that is protected by appropriate security controls.  
7. You will not rely on PPN Bridge as the sole repository for patient contact information or as a substitute for your organization’s required records, backup procedures, or compliance controls.  
8. If you suspect that this device or browser has been compromised, you will immediately stop using PPN Bridge for identifiable patient information and follow your organization’s incident response and notification procedures.  
9. You represent that you are authorized by your organization, or otherwise authorized under applicable law, to use this feature for locally stored patient contact information.  
10. PPN does not undertake responsibility for securing, recovering, monitoring, or preserving locally stored Bridge data unless expressly agreed in a separate written agreement.

Then add one short sentence beneath the checkbox:  
I understand that PPN Bridge stores identifiable patient contact data locally on this device, that PPN does not back up or recover that local data, and that I am responsible for determining whether this use is permitted and securely managed in my practice.

## **4\. What language should you avoid?**

Avoid these phrases:

1. “PPN bears no liability.”  
2. “HIPAA does not apply to this feature.”  
3. “Safe because it never touches our servers.”  
4. “You waive any claim.”  
5. “No breach obligations arise.”

Those are the kinds of lines that sound clever internally and age badly in a dispute.

## **5\. Are there state-level rules beyond HIPAA?**

Yes.  
And this is where founders usually get sloppy.  
The biggest ones I would flag immediately are these:

### **A. 42 CFR Part 2**

If any participating practice is a federally assisted program that provides SUD diagnosis, treatment, or referral for treatment, Part 2 can apply. HHS says Part 2 protects SUD patient records and generally prohibits sharing information that would identify someone as having a substance use disorder unless Part 2 specifically permits it. ([HHS.gov](https://www.hhs.gov/hipaa/part-2/index.html))  
That matters because psychedelic practices can overlap with addiction treatment, dual-diagnosis work, or receipt of Part 2 records.

### **B. Oregon psilocybin confidentiality rules**

Oregon’s psilocybin services rules require client data to be collected and reported in a way that protects confidentiality, and licensed service centers must create and retain a confidentiality plan describing how records are stored and maintained to prevent unauthorized access and protect client confidentiality. ([Oregon.gov](https://www.oregon.gov/oha/ph/preventionwellness/pages/psilocybin-data-dashboard.aspx))  
If any Bridge users are Oregon psilocybin service centers or facilitators, this is not optional background noise.

### **C. Washington My Health My Data Act**

Washington’s law was built specifically to cover health data collected by noncovered entities, including certain apps and websites. It is broader than many teams realize. ([Washington State Legislature](https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true))  
If Bridge is used by Washington practitioners or patients, you need a Washington-specific analysis.

### **D. Nevada consumer health data law**

Nevada’s law applies to regulated entities that do business in Nevada or target Nevada consumers and determine the purpose and means of processing consumer health data. It requires privacy policies, consent in certain circumstances, deletion rights, security procedures, and processor contracts. ([Nevada Legislature](https://www.leg.state.nv.us/Session/82nd2023/Bills/SB/SB370_EN.pdf))

### **E. California medical privacy law**

California’s Attorney General has expressly said that CMIA can apply to mobile apps designed to store medical information and that it provides protections beyond federal law. California’s statutory framework also restricts disclosures by providers and contractors. ([California Attorney General](https://oag.ca.gov/news/press-releases/attorney-general-bonta-emphasizes-health-apps-legal-obligation-protect))  
So the correct answer is not:  
“HIPAA is the only thing that matters.”  
The correct answer is:  
“HIPAA is only part of the analysis.”

## **6\. What happens if the practitioner’s device is compromised?**

The practitioner and their organization likely carry the most immediate exposure for storing identifiable patient information on a local device, because HIPAA’s Security Rule applies to covered entities and business associates protecting ePHI, and HHS specifically highlights risk when ePHI is accessed or used outside the organization’s physical control or on portable devices and external systems. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html))  
But do not assume you are automatically out.  
HHS says that if an app is provided by or on behalf of the covered entity and impermissibly discloses ePHI, the covered entity can be liable under HIPAA, and the app-side relationship may trigger BA analysis. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access-right-health-apps-apis/index.html))  
Also, if Bridge were treated as a non-HIPAA personal-health-record type service in some fact pattern, the FTC says a breach involving electronic personal health records can trigger the FTC Health Breach Notification Rule. ([Federal Trade Commission](https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business))  
So the honest answer is:

1. Practitioner-side liability is real and immediate.  
2. Your liability is lower if the feature is truly local-only and outside your actual control.  
3. Your liability is not zero if the feature is part of your contracted clinical product, especially if your code, your UI, your updates, your support model, or your documentation are what create and manage the local PHI repository.

## **7\. What matters more than the checkbox**

Do not try to solve this with wording first.  
Solve it with architecture.  
If you keep pursuing Bridge, I would require these controls before launch:

1. Feature disabled by default.  
2. Explicit per-device activation.  
3. No server sync, ever.  
4. No analytics, no session replay, no error telemetry, and no debugging logs on Bridge screens.  
5. Clear network-level verification that names, email addresses, and phone numbers never appear in requests, logs, screenshots, support tools, or crash traces.  
6. Local delete/reset control.  
7. Prominent “local-only, not backed up by PPN” banner in the feature.  
8. Separate legal review from the core de-identified PPN packet.

That last point matters. Bridge should be treated as a separate legal module, not tucked into the clean zero-identity story.

## **8\. My strategic recommendation**

For the next few weeks, while the trade show and demos matter most:  
Do not launch Bridge.  
Do not market Bridge.  
Do not discuss Bridge as a solved compliance feature.  
Keep the PPN story clean:  
de-identified core registry, structured outcomes, safety, benchmarking.  
Then run Bridge through a separate legal and architecture review.  
That is the disciplined move.  
Because right now, Bridge is the feature most likely to muddy your strongest differentiator.  
The one question that matters next is this: do you want Bridge to remain a purely local practitioner utility outside the core PPN product story, or do you actually want it to become part of the main platform offering?

\===  
I see it as an add-on feature for those practitioners who primarily practice on pen & paper and maybe have a spreadsheet with contacts and need some way to create a unified view without having to go back and forth between applications. We DO NOT want to venture into becoming an EHR vendor. 

The conversation arose from questions from customers and this note from one of our doctor/partner/advisor who is beta testing the app: "Quick question. How easy to toggle back and forth and how do I do it.  I want to pull up chart notes on client QXZ and give the a call, I have code for the login, how to a connect the (rigorously not connected) PHI-to call them, with the de-identified database?  Separate locked excel sheet?"  
\===

For now, tell the doctor to use a separate, practice-approved local contact source as the PHI source of truth, not an in-app Bridge feature inside PPN. That keeps PPN clean, preserves your core story before the trade show, and avoids drifting toward EHR behavior. A “locked Excel sheet” is only acceptable as a temporary clinic-side workaround if that clinic already permits it, the device is encrypted, access is controlled, and they understand that the clinic, not PPN, owns the PHI risk. If you build Bridge later, treat it as a separate local utility with separate legal review, not as part of the core de-identified product. HHS draws an important distinction between an app acting for the individual and an app provided by or on behalf of the covered entity; your proposed Bridge feature looks much closer to the second category. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access-right-health-apps-apis/index.html?utm_source=chatgpt.com))

## **My blunt recommendation**

Do not build Bridge into the main product right now.  
That is the clean answer.  
Your doctor’s request is real. The workflow problem is real. But the legal and category risk is also real. The danger is not that the idea is stupid. The danger is that it solves a convenience problem by contaminating your strongest positioning, which is that PPN is the de-identified clinical intelligence layer, not the PHI system of record.  
If you blur that boundary, you make the product easier to explain to one doctor and harder to explain to every serious buyer later.

## **What I would tell the doctor now**

Tell them this:  
PPN stays rigorously de-identified.  
Your clinic keeps the name and contact crosswalk outside PPN in your own approved system.  
Use the patient link code as the bridge between the two.  
That is the right operational answer.  
If they ask, “Separate locked Excel sheet?” the honest answer is:  
Yes, as a temporary clinic-side workflow if that is already allowed by their practice and secured appropriately. But PPN should not be the place where that contact information lives.  
I would not recommend “Excel” as your official language. I would say:  
“Use your existing chart, practice management system, or a practice-approved encrypted local contact file as the PHI source of truth.”  
That is cleaner and safer.

## **The product principle you need to lock**

You said you do not want to become an EHR vendor.  
Good. Then act like it.  
Here is the rule:  
PPN may reference a local patient link code.  
PPN should not become the place where real identity, contact, scheduling, reminders, calling, or outreach workflows live.  
Because the moment users can say, “I open PPN, see the patient’s name and number, and call them,” you are no longer just the de-identified registry in practical terms. You are functionally part of the identity-handling workflow.  
That changes the business story, the legal story, and the buyer expectation.

## **Best current-state workflow**

This is the one I would recommend immediately.

### **Core workflow**

1. The clinic maintains its PHI source separately.  
2. Each patient has a local clinic code or PPN link code.  
3. PPN stores only the de-identified code and clinical record.  
4. When the practitioner wants to call the patient, they use the code to look up the patient in their local chart, contact file, or approved spreadsheet.  
5. The phone call and chart notes remain outside PPN.

### **Why this is the best answer now**

1. It preserves your clean product boundary.  
2. It is easy to explain.  
3. It works today.  
4. It does not require emergency legal analysis before the trade show.  
5. It does not create false expectations that PPN is becoming a charting or contact system.

## **What you should build instead of Bridge, right now**

Solve the friction without storing PHI.  
Build one or more of these:

### **1\. Copy patient link code**

One click:  
“Copy patient link code”  
That lets the practitioner paste the code into their own local chart or contact file search.

### **2\. Bigger code visibility**

Make the patient code very easy to see, copy, and verify from the active session or chart view.

### **3\. QR or barcode support for the code only**

If the clinic uses printed or local crosswalks, scanning the code can speed up lookup without PPN storing identity.

### **4\. “Open local lookup” placeholder action**

Not a real integration. Just a UI affordance that reminds the practitioner:  
“Use your local contact source for identity and outreach.”  
That sounds simple, but it reinforces the product boundary.

## **What you should not build now**

Do not build these before counsel review:

1. Name, phone, or email fields inside the main authenticated PPN app  
2. In-browser local PHI storage inside the main product  
3. Call buttons  
4. Reminder workflows  
5. Text or email outreach tools  
6. “Temporary” local contact panels in the same UI

Those are exactly the kinds of “small convenience” features that turn a clean architecture into a muddled one.

## **If you ever build Bridge later**

If you eventually decide the workflow need is strong enough, then Bridge should be treated as a separate module with separate positioning, separate legal review, and ideally a stronger separation from the core app.  
Not because that magically eliminates risk. It does not.  
But because it keeps your business model and product story cleaner.

### **If you build it later, my requirements would be:**

1. Disabled by default  
2. Clearly labeled as local-only  
3. No server sync  
4. No backups by PPN  
5. No analytics or debug logging on Bridge screens  
6. Clear warning that the practitioner is responsible for device security and compliance  
7. Separate feature terms  
8. Separate legal review before release

HHS guidance is not friendly to simplistic reasoning like “we never see it, so it is not our problem.” An app can still raise HIPAA and business associate issues when it is provided by or on behalf of the covered entity, and HHS also makes clear that lack of plaintext visibility does not automatically eliminate business associate treatment in other storage contexts. ([HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/access-right-health-apps-apis/index.html?utm_source=chatgpt.com))

## **My recommended answer to the doctor’s note**

Use something like this:  
“PPN stays de-identified, so the identity-to-code crosswalk needs to stay in your own approved contact source, not inside PPN. For now, the clean workflow is to keep patient names and contact details in your local chart or other practice-approved encrypted file, and use the PPN patient link code to connect the two. We can make that easier by adding faster code copy, lookup support, and better session-to-code visibility without turning PPN into an EHR.”  
That is honest and strategically disciplined.

## **Strategic view**

You are being pulled by customer convenience toward identity features.  
That is normal.  
It is also how products lose their edge.  
The right founder move is not to satisfy every friction point directly.  
The right founder move is to decide which friction points belong inside your product category and which do not.  
This one does not belong inside your core product right now.

## **My recommendation, locked**

For the trade show and demos:

1. Keep PPN de-identified.  
2. Tell users the PHI crosswalk stays in their own approved system.  
3. Add non-PHI workflow helpers only.  
4. Defer Bridge until after specialist legal review.  
5. Do not let “temporary local storage” become the start of an EHR feature set.

Which matters more for your beta users right now, faster code lookup and copy workflow, or a truly integrated local contact helper?  
