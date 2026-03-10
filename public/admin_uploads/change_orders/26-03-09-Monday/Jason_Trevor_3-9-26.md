# **📝 Notes**

Mar 9, 2026

## **Jason : Trevor Updates 3-9-26**

### **Details**

* **Focus on Mobile Optimization and Testing**: Trevor explained that they are currently rebuilding the connections that drive the logs, inputs, and visuals, which is necessary before mobile optimization can be completed. They are also simultaneously creating mobile mockups because users will likely look at the product on their phone first, even if it is not the primary use device ([00:12:56](#heading=h.efp8imskcbwj)).

* **Defining Priorities for Testing**: Jason asked Trevor for their thoughts on prioritizing what needs to be ready for testing first ([00:14:38](#heading=h.cwzlfhsxo13t)). Trevor stated that they believe they are ready for closed beta testing within 24 hours, but first wanted to discuss and define what core functionality must be delivered ([00:15:38](#heading=h.gflylpam53gb)).

* **Using Use Cases to Validate Functionality**: Jason suggested basing the testing on use cases, proposing that if key functions like signing in, creating a new record, and updating a session work, then they should move forward ([00:15:38](#heading=h.gflylpam53gb)). Jason offered to help test these easy flows based on use cases ([00:16:47](#00:16:47)).

* **Confirmation of Foundation Stability and Testing Success**: Trevor agreed with the use case approach and confirmed that the foundation rebuild is complete and testing went well ([00:17:25](#00:17:25)). The testing of the new database had a 99% pass rate, which was a very positive result ([00:18:17](#00:18:17)).

* **Defining Core Use Cases for Testing**: Jason further defined the core use cases, including going through a complete session workflow (starting, updating, and closing a session) and performing follow-up model procedures like updating a protocol ([00:20:11](#00:20:11)). They also suggested use cases for pre-work, such as substance and drug interaction reviews ([00:20:57](#00:20:57)).

* **Proximity to Beta Launch and Sharing the Screen**: Trevor confirmed they are close to launching the beta, perhaps only hours away. They referenced a quote stating that if they are not embarrassed by version one, they launched too late, confirming the need to get the product into the hands of users ([00:21:47](#00:21:47)). Trevor then shared their screen ([00:22:42](#00:22:42)).

* **Review of New Features and Architectural Changes**: Trevor demonstrated a new "most recent" feature for quickly accessing the last session ([00:22:42](#00:22:42)). They explained that they are currently ensuring every input field writes to the database correctly, as local storage and caching caused inconsistent user experiences previously ([00:23:37](#00:23:37)).

* **Fixing Bugs and Improving User Experience**: Trevor confirmed they are addressing Jason's previous work orders and testing scenarios like hitting escape or the back button ([00:24:40](#00:24:40)). They noted that the mobile version of the application does not currently function the same as the desktop version ([00:25:22](#00:25:22)).

* **Testing the Dosing Protocol Workflow**: During a live test, Trevor demonstrated filling in the dosing protocol and advancing the screen ([00:25:22](#00:25:22)). They discussed the concept behind the "follow-up needed" checkbox, which is currently for practitioner notes, though it could easily be extended for other features if requested ([00:26:19](#00:26:19)).

* **Reviewing Psychometric Metrics and Contra-indicators**: Jason discussed the need to consult with Dr. Allen and Julian on the appropriate psychometric scoring tools for PTSD, anxiety, depression, and addiction ([00:27:03](#00:27:03)). During the live test, a contra-indicator pop-up, which should have fired when lithium and psilocybin were selected, did not appear ([00:28:57](#00:28:57)).

* **QT Tracker Feature and Clean-up**: Jason noted that the QT tracker feature was greatly improved, as they previously couldn't see the input boxes ([00:30:55](#00:30:55)). Trevor decided to make the QT tracker optional, moving away from controlling the doctor's behavior and only enforcing constraints around consent forms ([00:31:34](#00:31:34)).

* **Review of Session Timing and Updates**: Trevor initiated a dosing session, confirming the clock was running, and clarified the ambiguity around the "time zero" start of a session ([00:32:24](#00:32:24)). They then showed the "session update" feature for checking the patient's feeling and responsiveness, along with updated vitals ([00:33:51](#00:33:51)).

* **Local Storage of Practitioner Notes for HIPAA Compliance**: Trevor explained that practitioner notes are stored locally to avoid HIPAA issues, meaning they are not collected by the system. Jason confirmed that the guidance for doctors should be to export the log and save it if the notes are critical, as the exported log will contain all their notes ([00:33:51](#00:33:51)) ([00:35:38](#00:35:38)).

* **Vitals Trend Graph and Session Notes**: Jason praised the session vitals trend graph feature, noting its potential for multi-session data display down the road ([00:37:14](#00:37:14)). Trevor identified that they have two separate ledgers and note fields that need to be combined for better data consistency ([00:36:28](#00:36:28)) ([00:38:09](#00:38:09)).

* **Session Notes Design and Future Alert Capabilities**: Trevor discussed the different formatting options for session notes, leaning towards a more compact, informative version that will use a collapsible accordion design ([00:39:15](#00:39:15)). Jason suggested a future capability for practitioners to set up configurable reminders or alerts during a dosing session, such as reminders to check blood pressure ([00:40:00](#00:40:00)).

* **Identifying and Testing for Data Constraints**: Trevor discovered an issue where an extreme heart rate value (6,270) was entered, which messed up the graph, confirming the need to put input constraints on fields ([00:40:44](#00:40:44)). They agreed that trying to "break" the system with ridiculous inputs is a necessary phase of testing ([00:41:34](#00:41:34)).

* **Patient-Facing Features and Patient Input**: Trevor showed a screen intended for the patient to log their feelings without practitioner interaction, which would function as a "side app" on a separate tablet or phone ([00:42:22](#00:42:22)). Dr. Allen had previously liked this feature ([00:44:06](#00:44:06)).

* **Session Closeout and Post-Session Assessments**: Trevor successfully ended the session and demonstrated the closeout features, which include reviewing the timeline and ledgers ([00:46:05](#00:46:05)). The system then proceeds to post-session assessments, where they made the majority of the assessments optional ([00:47:02](#00:47:02)).

* **Testing Post-Session Assessment Workflow**: Trevor tested the auto-advancing feature within the assessment forms, where hitting a number key automatically advances to the next question. They agreed that this streamlined process greatly improves upon traditional notebook or medical system logging ([00:47:54](#00:47:54)).

* **Post-Treatment Integration and Future Reports**: Trevor demonstrated the phase three post-treatment integration screens, which are not fully updated but will eventually use accordions to condense information. The long-term plan includes having the system populate a patient's PHQ-9 scores over multiple sessions to show progress ([00:48:57](#00:48:57)) ([00:52:49](#00:52:49)).

* **New Progress Summary and Patient-Facing Page**: Trevor shared a new mobile-formatted "Progress Summary" report that can be printed or exported ([00:53:56](#00:53:56)). They then introduced the new "patient-facing" page, which provides post-session support based on market research indicating patient anxiety and feeling lost between sessions ([00:54:48](#00:54:48)).

* **Customized Patient URL and Shareable Content**: The patient-facing page features a customizable URL tied to an anonymized patient ID ([00:54:48](#00:54:48)). The practitioner can select various content to share with the patient using a "generate magic link" feature, which Jason appreciated as a valuable way to follow up with patients ([00:56:10](#00:56:10)).

* **Review of Patient Journey Versions**: Trevor presented two versions of the patient journey interface, Version A and Version B (the live version), with the intent to integrate the favorable parts of both ([00:57:08](#00:57:08)). The current live version includes a static notes field where practitioners can record information or notes for the patient ([00:59:05](#00:59:05)).

* **Introduction of Magic Link and Patient Check-ins**: A key feature demonstrated is the "magic link," which allows patients to check in, describe their mood and sleep quality, and automatically update their treatment record without needing to set up an account or password ([00:59:05](#00:59:05)). Jason  expressed that this feature, which was previously discussed, is brilliant and exactly what they wanted ([01:00:21](#01:00:21)).

* **Physical and Emotional Mapping for Patients**: The interface includes a "compass" map for the patient's physical, emotional, mental, and spiritual state, described as "integrations where healing becomes real" ([01:00:21](#01:00:21)). This map can be totally customized for every single patient and serves as a guide between sessions ([01:01:01](#01:01:01)).

* **Scientific vs. Experiential Data Presentation**: The system captures scientific measurements (e.g., neuroplasticity, dopamine) but allows patients to view the data from an "experiential" perspective, focusing on things like ego, sensory, and emotional states, which is more easily understood by them ([01:01:01](#01:01:01)). Jason  suggested that the maps should be customized for each substance administered (e.g., psilocybin, MDMA), and that multiple charts would be necessary if multiple substances were involved ([01:02:05](#01:02:05)).

* **Recommendation to Default to Experiential View**: Jason  recommended that the patient journey should default to the experiential view and potentially only show that, arguing that patients may not understand the biological data. Trevor agreed that defaulting to the experiential view is good input ([01:03:50](#01:03:50)).

* **Pharmokinetic Plan Visualization**: The application includes a "pharmokinetic plan" that visualizes what is happening to the patient's body during and after treatment, including when they peaked. This visualization pulls data from treatment readings and patient check-ins, allowing patients to visually track trends in their mood or other variables following treatment ([01:04:33](#01:04:33)).

* **Feedback on Pharmokinetic Chart Axes**: When discussing the pharmokinetic chart, Jason  sought clarification on the X and Y axes, confirming that time is the X-axis and intensity is the Y-axis. They also provided feedback that data points for components like "chest, head, and gut" should appear along the curve of the X-axis rather than being part of the legend, which Trevor noted was due to missing dots in the dummy data ([01:05:31](#01:05:31)).

* **Extending Practitioner Reach and Sharing Capabilities**: Trevor explained that the tool is designed to extend the practitioner's practice beyond the therapy session by allowing patients to share their journey with friends, or with a new practitioner who is not on the PPN platform ([01:06:17](#01:06:17)). Jason  called this concept "brilliant" and a game changer that is "well beyond" their initial expectations ([01:07:13](#01:07:13)).

* **Handling HIPAA and Data Sharing Security**: Trevor addressed HIPAA concerns regarding data sharing by explaining that when a doctor shares the patient link (the query), the information goes directly from the doctor's device to the patient and never to the database, as it queries the patient record based only on their ID number ([01:11:08](#01:11:08)). This method allows the doctor to share information without providing the system with the patient's private information ([01:11:58](#01:11:58)).

* **Practitioner Customization and Development Priorities**: Jason  suggested that practitioners should be allowed to design the world they want to live in with the follow-up tool, by being shown the capabilities and then designing the elements ([01:08:34](#01:08:34)). To save development time, they agreed to prioritize tightening up the existing functionality over adding new features at this time ([01:09:28](#01:09:28)) ([01:32:44](#01:32:44)).

* **Review of Discharge Summary and Reporting Features**: Trevor demonstrated the discharge summary, which is currently a text-based report and has the potential to integrate with EHR systems like Epic via CSV export or automation ([01:13:48](#01:13:48)). The system also includes an export function allowing customization of specialized reports, including an audit report, an insurance report for billing, and a research report ([01:16:05](#01:16:05)).

* **Compliance Automation and Administrative Pillar**: The system automatically generates reports necessary for compliance, such as the Oregon audit requirements for practitioners, thereby simplifying compliance for practitioners who use the system for treatment. Jason  articulated the system's functions into pillars: front-end patient health assessment, in-session event tracking, patient follow-up, and external administrative requirements, which simplifies the full spectrum of patient to administrative needs ([01:17:21](#01:17:21)).

* **Download Center and Menu Flow**: A "download center" was created so doctors can access all their reports in one centralized place, for both clinical and patient-level records ([01:19:02](#01:19:02)). Jason  suggested reorganizing the menu on the left sidebar to align with the chronological flow of patient interaction (incoming, in-session, outgoing administrative) ([01:20:51](#01:20:51)).

* **Default Landing Page and Dashboard Clean-up**: Trevor confirmed that the default landing page has been changed to "search" per an original request, with the cursor automatically activated in the search bar ([01:21:48](#01:21:48)). The dashboard has been streamlined to show only essential stats and quick actions, reducing redundancy ([01:22:39](#01:22:39)).

* **Addressing Bugs in Wellness Journey Flow**: Trevor identified a bug where a wellness journey session remained active or did not properly shut off, necessitating a "shut off mechanism" to start a new one. They also noted that a new feature for resuming a journey was activated, but the closing function was not yet implemented ([01:23:33](#01:23:33)) ([01:25:19](#01:25:19)).

* **Next Steps for Testing**: The goal is to have the updated tool done by the afternoon and prioritized bugs fixed for internal testing, with the stretch goal of having testing the tool before they return ([01:26:10](#01:26:10)). Jason  confirmed they are available that afternoon to test ([01:28:26](#01:28:26)).

* **Bug Reporting and Video Tutorials**: A new feature was added to allow users to easily report a bug, request a feature, or send a note, with the bug reporting potentially capturing the console to assist with diagnosis ([01:28:26](#01:28:26)). Trevor is also creating video tutorials for every screen to help users understand the system without needing help ([01:30:02](#01:30:02)).

* **New User Registration Flow Complexity**: Trevor explained that the complexity of the login and registration system increased because it required reorganizing how patients were created based on users and location, which was necessary before patient IDs could properly fire ([01:30:49](#01:30:49)). They confirmed they will need to rigorously test the flow for a brand new user who has never interacted with the platform ([01:31:57](#01:31:57)).

* **Testing Needs and Development Focus**: Jason  offered to use dummy emails to test the new login flow ([01:33:30](#heading=h.r5dbkbtbg8io)). The immediate development focus is on tightening up the existing functionality, and if a task cannot be tightened up quickly, it will be dropped from the immediate scope ([01:32:44](#01:32:44)).

### **Suggested next steps**

- [ ] Jason will help test the key functioning points/use cases like signing in, creating a new record, opening a session, running and updating the session.  
- [ ] Trevor will work on putting a constraint on the heart rate input field because an entered value of 6,270 ruined the graph.  
- [ ] Trevor will verify that doctors can see all protocol details, including notes, when reviewing past protocols, provided they have not wiped their machine.  
- [ ] Trevor will combine the two separate ledgers and two note fields to resolve the messy data structure.  
- [ ] Trevor and Jason will agree on the key points/use cases that need to be functioning for the product release and document them in the use case tab in the workbook.  
- [ ] Jason will test the brand new user sign-up flow using a dummy email once the new version is pushed live.  
- [ ] Trevor will update the patient view to default to experiential information, while maintaining the option to look at biological information.  
- [ ] Trevor will make a note to figure out the issue where the wellness journey does not close out after a session, and fix the bug related to the shut-off mechanism.

# **📖 Transcript**

Mar 9, 2026

## **Jason : Trevor Updates 3-9-26 \- Transcript**

**Jason:** when so I I've thought about the best way to approach this as well and I think I just base this stuff on use cases and I would I would I would offer up that if we can agree on the use cases and the platform we want to use for example, just the ability to go in and smoothly create a new record, open a session, get it to run, update the session, and kind of work through and then that basic functionality is working.  
   
 

### **00:16:47** {#00:16:47}

   
**Jason:** If we've got there's probably three or four of them, but I can help test just those easy flows, and if those are working, then yeah, 100% green light. I think it's just use casebased and getting them to do it would be my thought. And I think there's probably, you know, three or four different ones. Dr. Allan will push it a little. Sarah will push her side a little more simply. I think we just have those basic abilities to walk through and do real life scenarios. I agree. I agree with you. We're I think then we're good to go. All the other noise and everything around. So I think it's probably use case based. If we can agree on those and I can help test them, then we can just green light those and get those out there.  
   
 

### **00:17:25** {#00:17:25}

   
**Jason:** If that's kind of what you're thinking because not every button needs to work, but if a use case flows well, then I think it's good.  
**Trevor:** Yeah. and like I've got I mean I'm I'm  
**Jason:** Show me the new stuff.  
**Trevor:** I'm Say again.  
**Jason:** Show me the new  
**Trevor:**  
**Jason:** stuff.  
**Trevor:** Well, I just want to, you know, acknowledge I'm I'm I'm addressing all that and and I agree with you. and all a lot of the things that we're identifying are going to be fixed. I just had to sort of pause everything because I was like one it makes no sense to to do anything else until the foundation is correct because I'm going to have  
**Jason:** Yeah.  
**Trevor:** to read anything I do I have to redo.  
**Jason:** Okay.  
**Trevor:** and so that's done.  
**Jason:** Agree.  
**Trevor:** and the testing went really well.  
   
 

### **00:18:17** {#00:18:17}

   
**Trevor:** In fact, it was like 99% passed, which was f\*\*\*\*\*\* great.  
**Jason:** Wow.  
**Trevor:** Yeah, for the database. I mean, it literally had I got all the way through and it was like my second to last test out of like 50 and it was like, oh, this one field is not formatted. And I was like, oh, I was like, but still, I mean, it went really well. So, I'm really pleased about that. So, let me I think we should get to your question first and then I can show you kind of things that have been done because I got a million  
**Jason:** Yeah.  
**Trevor:** different tasks on my list.  
**Jason:** And my question being use cases or what  
**Trevor:** Yeah. So, exactly.  
**Jason:** was  
**Trevor:** So let me share  
**Jason:** I put the I was where I was going to capture the use cases and this is just I kind of how I viewed it right was if we can get people to reasonably work through or at least flag where there might be like maybe there's not a back button on a screen you just have to X out.  
   
 

### **00:19:25**

   
**Jason:** Little things like that are no big deal. But you know the protocol is just getting them to go in almost unguided creating a new protocol updating an old protocol or the one they just created in real life. So I kind of was going to start putting those on my use case tab in that workbook. So anyway, that was my thought, but there's one in there now, but the next one would be we know we just would want to agree on those. Then I can just test them on all platforms for us.  
**Trevor:** back up just so I may I'm sure I heard because I was sharing my screen and I got distracted for a second. So say the first part of that again.  
**Jason:** So so I my my my thought is just my opinion is that we do this in a use case you know that we I think there's four so we so I'm  
   
 

### **00:20:11** {#00:20:11}

   
**Trevor:** workflow.  
**Jason:** able to go in using the three different create your own custom thing do  
**Trevor:** Yeah.  
**Jason:** You know basically I want to create a new test for our new use case. We already have the one where we go through in the tool all formats, all mediums and are able to get a session going and started and updated as if basically as if I'm sitting in front of a client. Right? That would be use case number one. Clo go through a session,  
**Trevor:** Sure.  
**Jason:** update, close it out. That would be once that's working good enough, then I think that one's a check. The next one would be going back and updating that protocol. That would be use case number two, right? doing follow-ups because these guys we're trying to give them real world situations.  
   
 

### **00:20:57** {#00:20:57}

   
**Jason:** So going through their sort of follow-up model and the steps there I would say is a new one. and then other things like substances, you know, doing the substance review or the drug interaction. Those were kind of an analysis of like some of the pre-work for example that they get from folks in their phone calls before they walk in. So, basically, I'm just trying to imagine use cases where someone's now in my office. I've done my pre-screening. I'm getting them set up. I'm getting the blood pressure going, the heart rate, and just basically as if they're in the chair, and I'm not going to wait eight hours, but I'm going to do an update every dosing. Just kind of do that. If that's working, dude, for I mean, generally speaking, I think that's how it tells us that they can actually use it.  
**Trevor:** Okay, good. because we're really close.  
   
 

### **00:21:47** {#00:21:47}

   
**Trevor:** I in fact I mean we  
**Jason:** Okay,  
**Trevor:** are hours away maybe maybe maybe minutes but probably  
**Jason:** Cool.  
**Trevor:** hours because I the last I was reading a quote because I wanted to make sure that I you know I had a proper understanding and the founder of LinkedIn said if you're not embarrassed by version one you launched too late And I was like, "Yeah,  
**Jason:** H.  
**Trevor:** Okay." because I think you and I both I think we're both aligned as like, "Oh, we want to we want to show, right? Like we want to have a positive showing." but we got to get it in the hands of the people that  
**Jason:** Yeah.  
**Trevor:** actually be using it. So I think we are today.  
**Jason:** Agreed.  
**Trevor:** unless something comes up in the testing that I'm not aware of, I think we're good.  
**Jason:** Okay.  
**Trevor:** So can you see my screen?  
   
 

### **00:22:42** {#00:22:42}

   
**Jason:** yeah, let me see , kind of me resize stuff here.  
**Trevor:** I don't know how to pin that. So it's just you are  
**Jason:** Exit zoom mode.  
**Trevor:** presenting. Show my screen anyway.  
**Jason:** See,  
**Trevor:** What do you see? Like I see my screen.  
**Jason:** It says start a wellness session.  
**Trevor:** Okay, good. but do you also have to look at my face when we're doing this?  
**Jason:** yeah, I can see your face,  
**Trevor:** Okay.  
**Jason:** Too.  
**Trevor:** All right. okay. So, oh, let me get rid of that.  
**Jason:** Oh, cool. You added a most recent.  
**Trevor:** Yeah.  
**Jason:** Oh, cool. That's  
**Trevor:**  
**Jason:** convenient.  
**Trevor:** That, that way they can just go into the last one.  
   
 

### **00:23:37** {#00:23:37}

   
**Jason:** That's perfect. Yeah.  
**Trevor:** and but right now I don't have any in there because I've got test cases, but this is part of the new I'm making sure right now I'm making sure that every field you can input in is is writing to the right place because what I discovered was I was like, why are some of my fields empty? And because the data was just storing locally, which explained why you were having a different experience on the website than I was because my  
**Jason:** Yeah.  
**Trevor:** my machine was catching a ton of stuff and filling in the blanks and I was like, what? I don't understand. So,  
**Jason:** Okay.  
**Trevor:** so most of this isn't going to have changed yet, but some of it is changing architecturally. And then we will be getting rid of these modals and most of this is just going to become screen. so no real changes here. Let me just go in here and I I actually don't know if there's any visible changes.  
   
 

### **00:24:40** {#00:24:40}

   
**Trevor:** Although I am working on testing if you hit escape on that screen, what happens? You know, if I hit the back button, what happens?  
**Jason:** Yeah.  
**Trevor:** like all of that stuff that you like I went through and did all of your spreadsheet work orders. So,  
**Jason:** So,  
**Trevor:**  
**Jason:** like if you go to edit edit config, does it go right back to it?  
**Trevor:** that's actually underway right now. I don't even know.  
**Jason:** Oh, cool.  
**Trevor:** so,  
**Jason:** Okay.  
**Trevor:** because literally I just ripped the whole whole database out and I put it back together today.  
**Jason:** Yeah.  
**Trevor:** So,  
**Jason:** Yeah. No, no problem. I'll just ask him.  
**Trevor:** But like so when we were talking about do we have a a viable product like yeah we have an MVP but then you know when we go here to mobile I you know  
   
 

### **00:25:22** {#00:25:22}

   
**Jason:** Cool.  
**Trevor:** I'm just it doesn't work the same. So I'll show you some of my ideas and some things that I'm working on. but right now we've got still got our like skip to QA. but let's just test it right now and we'll see since we're looking at it.  
**Jason:** No.  
**Trevor:** We'll just put in everything.  
**Jason:** Oh, nice.  
**Trevor:** Okay then.  
**Jason:** It advanced. That wasn't right.  
**Trevor:** That Yeah.  
**Jason:** Did the MEQ advance as well?  
**Trevor:** And then I Well,  
**Jason:** Did it say the MEQ stuff?  
**Trevor:** I I bounced the MEQ30 out to the  
**Jason:** Okay.  
**Trevor:** end. So,  
**Jason:** Okay.  
**Trevor:** but let's actually select everything and we'll see how this works because this is what I was going to have to do anyway.  
   
 

### **00:26:19** {#00:26:19}

   
**Trevor:** So,  
**Jason:** Yeah,  
**Trevor:**  
**Jason:** This is what I'd be doing.  
**Trevor:** Yeah. So, we'll go safe.  
**Jason:** And the and the just for process the the follow-up needed is there like some what is what happens when you select that? Is there some way to get an email generated or I know it's probably not developed yet, but what's the concept behind it?  
**Trevor:** No, that was just for the practitioner notes.  
**Jason:** Okay. Okay. Gotcha.  
**Trevor:** but you know, if they want something that that part's easy.  
**Jason:** Yeah, we'll do that  
**Trevor:** okay. So, I'll put some values in here.  
**Jason:** later.  
**Trevor:** And like right now PCL isn't writing to anything.  
**Jason:** Well,  
**Trevor:** so I got  
**Jason:** Eventually we'll have whatever we land on in the psycho metric will be one for each, right?  
   
 

### **00:27:03** {#00:27:03}

   
**Jason:** You got PTSD, anxiety, you got depression, you got addiction. So, that's four. Whatever they end up being. I'm cut we want to really ask Dr. Allan what the right ones to use are and probably Julian as well because he's really in he he uses these scoring things like religiously probably more than Dr. Allen. So when we get to him we'll ask him the proper ones.  
**Trevor:** Okay, I'm putting in lithium so that we can test the interaction checker.  
**Jason:** Okay.  
**Trevor:** But I'm I'm I'm also making notes of things that I caught. So, this is a stepper. That's not supposed to be a stepper for 80\. Okay. And let's bump this up.  
**Jason:** Yeah,  
**Trevor:** Okay.  
**Jason:** I see the patient treatment expectancy too. That's nice.  
**Trevor:** Yeah, that was Sarah's suggestion. okay. So, we just entered all four.  
   
 

### **00:28:08**

   
**Trevor:** Now, what you should see, and it's working, which is great, is that all four steps are done, and the preparation summary is in here.  
**Jason:** Mhm.  
**Trevor:** and the medication is listening and a confirmation that all of your data is good. So, you've sort of got I I'm not Well,  
**Jason:** Nice.  
**Trevor:** I guess this is formatted that way because it's supposed to fit. Yeah. Okay. So, good. So, we got our little heads up display. We've got confirmation that says boom, you're good to go to phase two. Let me go back down to 100%.  
**Jason:** Yep. Yeah, I like how that's cleaned up, too. with the confirmation that it's and with the confirmation that it's all been gone through. Four out of four. Check, check, check. And then the one big button at the bottom is good.  
   
 

### **00:28:57** {#00:28:57}

   
**Jason:** So,  
**Trevor:** Thank you. by the way, anything right now that isn't a core feature that isn't working, I'm just pulling out.  
**Jason:** Yeah.  
**Trevor:** We're not,  
**Jason:** Yeah.  
**Trevor:** so, okay. So, you're familiar with all this. I'm also going to clean this up to make it a little more compact. Like,  
**Jason:** Yep.  
**Trevor:** I'm going to combine this line and this line, the step one dosing protocol. Get rid of these little required chips.  
**Jason:** Yep.  
**Trevor:** So as of this morning, I 'm still going to do psilocybin. See if this is fixed. No, it's not. It's not resizing. Okay. Little things like that. And okay, so right there the contra indicator should have popped because I selected psilocybin and lithium.  
**Jason:** No,  
**Trevor:** So all  
**Jason:** it says no substance selected is probably why on the right follow  
   
 

### **00:29:59**

   
**Trevor:** Right.  
**Jason:** the right horizontal to horizontal to where your mouse was your cursor phone.  
**Trevor:** Oh yeah. Yeah.  
**Jason:** It says it didn't even save it. So, that probably is it.  
**Trevor:** Yep. Perfect. okay. Well, then that means we can just keep with our testing because before what was happening was it would fire, but then it wouldn't go away. I couldn't get the giant red thing to go away.  
**Jason:** Oh, hard to unring a  
**Trevor:** yeah.  
**Jason:** bell.  
**Trevor:** So, we'll just put all this in. I got a little cleaned up like this font, you know, stupid stuff. But  
**Jason:** Yeah, it's all workable though. Yeah. Oh, this is much better. You did. I was going to see what you did with the QT tracker.  
**Trevor:**  
**Jason:** Okay, this is much better.  
   
 

### **00:30:55** {#00:30:55}

   
**Jason:** I couldn't even see those before. They were these little boxes with nothing in them.  
**Trevor:** Oh, really?  
**Jason:** Yeah, like you couldn't it just had empty boxes with arrows.  
**Trevor:** Yeah.  
**Jason:** It meant nothing. So, I put in my notes. Yeah, this is totally fixed. This is great. This was the one that was one section I thought for even though this is not Ibagane because QT tracker is it's a heart thing right the delay of the of the heart pumping or the valves or I I don't remember exactly Viv when she hurt her head on the stairs she they had to put her on that so I'm familiar with it but you may or may not use it except for ibeance I brain it has to be a requirement I think is what he is how he looks at it.  
**Trevor:** Yeah. Yeah.  
   
 

### **00:31:34** {#00:31:34}

   
**Trevor:** Exactly. and and I did have it so it would fire only on Ibagain, but then I just I was I'm separating myself from the principle that I am using as a guide is we are not here to control the doctor's behavior in any way. So I decided to make it optional.  
**Jason:** Right.  
**Trevor:** And there's very few things in here you that you that prevent the doctors from doing something u mostly around the consent forms and  
**Jason:** Yeah.  
**Trevor:** stuff.  
**Jason:** Cool. I agree with you. We have it already built.  
**Trevor:**  
**Jason:** We can have it there as available if needed. So yeah, I like it. And it's cleaned up now because I couldn't read Phillips or anything before. Shill or nothing. Yeah,  
**Trevor:** really  
**Jason:** It was all I. You'll look at the screenshots I did.  
   
 

### **00:32:24** {#00:32:24}

   
**Jason:** There's like just two little black boxes. Well, four total. And then you didn't know what they you couldn't even get a drop down to appear. But it's all fixed. So it's a move point.  
**Trevor:** Cool. Okay,  
**Jason:**  
**Trevor:** dosing's in except the medication didn't take. So, that's good to know.  
**Jason:** Yeah.  
**Trevor:** Vitals are in. And boom. Let's go. Okay. So, now you've seen all this, right?  
**Jason:** Can you just scroll back up?  
**Trevor:** Or no?  
**Jason:** so we're in the dosing session. It's clock's running, right?  
**Trevor:** Yep. I just clicked it.  
**Jason:** Cool. Okay.  
**Trevor:** Have I shown you this yet?  
**Jason:** I've seen this before. Yeah, this was on the This was on Yeah,  
   
 

### **00:33:00**

   
**Trevor:** You saw the graph.  
**Jason:** the graph I couldn't get working on mine. So, I'm I'm I'm anxious to see  
**Trevor:** Okay, great. okay. So, dosing started at time zero. and I know that's not technically correct, but  
**Jason:** That'll be the guide, right? So, that's a little bit of the nuance. So, what we'll just tell them is click click the start or the last completed. Maybe that's what we do is the button up top rather than have it say completed, if we say start the session. You know that last dosing box, the three up top. And then they know that's when the clock starts ticking. That's zero. Even though they gave up 45 minutes  
**Trevor:** Yeah,  
**Jason:** ago.  
**Trevor:** That's a great clarification to get and that's exactly the kind of example that we want.  
   
 

### **00:33:51** {#00:33:51}

   
**Trevor:** Okay, so right here we've got a session update.  
**Jason:** Yeah.  
**Trevor:** This is going to be sort of the main kind of check-in, you know, how's how the patient is feeling? what's their responsiveness? So, you know, and we can tweak these and then and then updated vitals.  
**Jason:** That's great. No, it's fantastic.  
**Trevor:** And this is what I did. I think that this is what I'm very excited about. So I don't know if you can read this, but it says the note is not if it's stored locally and they can export it, but we never take these notes. We don't collect them.  
**Jason:** Right.  
**Trevor:** So I'm going to test this  
**Jason:** When you say locally,  
**Trevor:** out.  
**Jason:** let's say let's say someone calls in. So use case, right? This is up and running. We've got multiple clinics doing it.  
   
 

### **00:34:41**

   
**Jason:** Bob back east is looking at Dr. Allen. He did a protocol that he's really interested in repeating, right? And so he clicks on it on his end and he can see it, but he doesn't see any notes. All he sees is dosing and stuff. So he calls Dr. Allen and says, "Hey man, I'm really interested in this case. Here's the number. Can you pull it up?" And Dr. Allen pulls it up and he's like, "Oh, I have a bunch of notes in my version that were critical to helping you succeed. Is that what you mean by local storage that the local person will still have access to that or does it just disappear?  
**Trevor:** no. It it will stay in here unless  
**Jason:** cuz  
**Trevor:** They change devices. Okay. But it's if they lose their device or they don't like to transfer or export.  
   
 

### **00:35:38** {#00:35:38}

   
**Trevor:** The point is we in order for us to avoid any HIPPA, we can't have the architecture allow that to get sent to us.  
**Jason:** Yeah,  
**Trevor:** So what I did is I built a workaround.  
**Jason:** Right.  
**Trevor:** So for the doctors, it's fine, but it gives us the ability to continue doing the whole privacybased model.  
**Jason:** Will export logs have the notes in it?  
**Trevor:** so  
**Jason:** Okay. So if I'm So then the the suggested work is doctors if you're done if you have something that's pretty  
**Trevor:** Yep.  
**Jason:** note intensive make sure you export that log and save it because for HIPPA we can't. And so if somebody were to call up and need some details if it's not in your notebook that export log will save you that will have all of your notes. Is that kind of the guidance we would give them in those instances?  
   
 

### **00:36:28** {#00:36:28}

   
**Trevor:** 100%. And Yep.  
**Jason:** Perfect. That  
**Trevor:** Yep. Exactly. And as long as it's store,  
**Jason:** works.  
**Trevor:** You know, as long as they don't wipe their machine and all that, I will verify this because but when they go back in and look at their protocols and they pull up the protocol detail, they should be able to see everything that happened.  
**Jason:** Okay.  
**Trevor:** and so you can see right here that the notes test that I made did fire.  
**Jason:** Oh,  
**Trevor:** And it's on the ledger right now.  
**Jason:** Cool.  
**Trevor:** What I've got going I got the old ledger and I got a new ledger and this stuff is firing and it's going to the graph but it's not keeping on this ledger. So I've got to figure out I got to combine these two because I've got two separate ledgers going and two note fields and it's just kind of messy.  
   
 

### **00:37:14** {#00:37:14}

   
**Jason:** Okay. Can you do me a favor on the V session vitals trend to the right?  
**Trevor:** So  
**Jason:** Can you deselect everything about heart rate? This feature I really liked. Okay, that's working on that's working on this.  
**Trevor:** yeah,  
**Jason:** This is sexy, dude. I like that part.  
**Trevor:** Check this out. So  
**Jason:** That was a nice detail.  
**Trevor:** Thanks. So you saw the trend lines, right?  
**Jason:** Yeah. And you can see which ones. Yeah, that's Yeah, it's great. That's what wasn't working on mine. so I'm glad I'm glad you got those in because that I think that right there, man, is they're just going along. This probably is. I can see it down the road. This will be like the pop out screen or something that they can just have multiple sessions, you know, with multiple different vitals going along or something.  
   
 

### **00:38:09** {#00:38:09}

   
**Jason:** I mean, I don't know how we'll do it, but the multi-session thing after we get the single sessions working, but this part I think they're just going to really that'll be really helpful.  
**Trevor:** Thank you. okay. This note is not disappearing, but that's all right. good to know. Okay, so yeah, so now we've got all of these going and let's see if the interaction checker fires this time. Nope. Okay, good to know. I did I did an addition additional dose and All right, so this is I'm just I'm just testing a couple things out  
**Jason:** Yeah,  
**Trevor:** Here.  
**Jason:** This is great.  
**Trevor:** Okay, so now my ah yeah, okay, this is to be expected. So I'm still getting all this stuff hooked back up. So session notes are firing and I bet this is right in mid testing right now. because this is actually  
**Jason:** So, which one you think you're going to go with on the session  
   
 

### **00:39:15** {#00:39:15}

   
**Trevor:** well so ironically I like the formatting of this one better because each one had a different icon  
**Jason:** notes?  
**Trevor:** and it they but this one works better. It's more compact. It's got more information.  
**Jason:** No.  
**Trevor:** I might What do you think?  
**Jason:** I mean I like the one that took if it's the same quantity of data in one, two, three, four, five lines that you got in those two, right? I'm assuming there'll be a scroll. I like the smaller, more compact one.  
**Trevor:** Well, it's either way it's going to be an accordion,  
**Jason:** this okay  
**Trevor:** So it'll be collapsible.  
**Jason:** but well the next one was I don't know what p.spoke is but music decision dose like are those  
**Trevor:**  
**Jason:** quick  
**Trevor:** no,  
**Jason:** links?  
**Trevor:** these are the same as these.  
   
 

### **00:40:00** {#00:40:00}

   
**Trevor:** They're just quick they're the same as these,  
**Jason:** Oh okay.  
**Trevor:** but they don't come with additional information. So, what you can see is Oh, maybe that's why it's not I didn't see if it was firing.  
**Jason:** Ah,  
**Trevor:** Okay, I had the filters turned off. there we go. Got rid of Damn it. Get out of there. Let's see. Okay. So,  
**Jason:** you know,  
**Trevor:** if you hold  
**Jason:** I'm going to plant a seed real fast before you move on. I think what people are going to to want to do is set their own little triggers.  
**Trevor:** on  
**Jason:** Like, this is just a future. This is not we do not put this in now. But imagine you're in a dosing session. You're like, you know what? in 20 minutes time, I want a chime or a little alarm to go off and remind me that I need to do my my dosing.  
   
 

### **00:40:44** {#00:40:44}

   
**Jason:** Right? So, you've got your historical, but then you can kind of tell it to plan the future. And then it will just be like ding ding ding ding while they're walking around or in there talking with them. So, it's kind of like an alert. I think that's a capability we would want to add at some point. Or reminders or reminders to go check BP or maybe configurable in practitioner settings. I'm just brain dumping here, but I could see them wanting to have a little reminders rather than sitting there every minute.  
**Trevor:** Yeah, that makes sense. I'm identifying some other things that I want to test like,  
**Jason:** Okay.  
**Trevor:** okay, I just entered a typo. how do we deal with typos? so, but and it ruined my whole graph because I put 6,270 on the heart rate.  
**Jason:** Well,  
**Trevor:**  
   
 

### **00:41:34** {#00:41:34}

   
**Jason:** that's just the price of oil  
**Trevor:** yeah, I know exactly. I just got to put a constraint in there because if they're at 6,200,  
**Jason:** now.  
**Trevor:** they're dead. constraints and all these should have constraints already. So, I just probably an input thing. but these are the kinds of things that the the the practitioners are going to find for us anyway.  
**Jason:** Yep.  
**Trevor:** my screen's freezing up here.  
**Jason:** Yeah. Well, once we have our just the testing, once we have it basically functioning, then we deliberately design in enter ridiculous information into each cell and see how it handles it. So then we try and break it, right? So that'll be step phase two of  
**Trevor:** Yeah,  
**Jason:** testing.  
**Trevor:** this is good. I'm this is this is what I was doing when we started this meeting was doing kind of full going through this.  
   
 

### **00:42:22** {#00:42:22}

   
**Trevor:** But anything else you want me to you have questions about? Oh, what what I was going to show you is these things here. the patient spoke music decision and this dose should not be in here. what they do is they they make a mark on the on the graph but that's it. So but there there's deeper functionality there.  
**Jason:** Oh,  
**Trevor:** I just haven't installed  
**Jason:** cool. Yeah.  
**Trevor:** it.  
**Jason:** No, this is great, dude. Yeah, very Yeah, I know why you're saying we're Now, this one I didn't get. I saw some I didn't What do we What's What's kind of the expectation with this screen because I couldn't get the bottom to do  
**Trevor:** This was No, it doesn't do anything.  
**Jason:** anything.  
**Trevor:** It's it's that's part of what's being reconnected. So the the idea the concept was to allow the  
   
 

### **00:43:12**

   
**Jason:** Okay.  
**Trevor:** the patient to identify how they are feeling and log it without having to interact with the practitioner.  
**Jason:** Gotcha.  
**Trevor:** and I just threw this in there because I thought it was cool and it gave them something to kind of like look at, you know, and just sort of if they wanted to, you know,  
**Jason:** This this this system is probably going to be sitting outside the room though, right?  
**Trevor:** well, this this would be a side app.  
**Jason:** Like on their note.  
**Trevor:** So,  
**Jason:** Oh.  
**Trevor:** this would be like Yeah.  
**Jason:** Oh, okay. Okay.  
**Trevor:** Yeah. Right. It's just a feature that I threw in there.  
**Jason:** Okay.  
**Trevor:** because I was like okay right now the way this is designed is the practitioner has to interact with the use with the patient in order to get a reading on their emotions  
   
 

### **00:44:06** {#00:44:06}

   
**Jason:** Yep.  
**Trevor:** and why not like enable them to take that extra step out. And so that's what I put this in here for. And then I was like well if they're going to do that they're going to give the patient the ability like a separate tablet or  
**Jason:** Yep.  
**Trevor:** their phone. so I haven't built the site app functionality yet, but for now, but when I showed this to Dr. Allen, he loved the feature, which I thought was, you know, I mean,  
**Jason:** Yeah.  
**Trevor:** he like he said he liked it.  
**Jason:** Yeah. Well, I mean, if nothing else, they can put it on.  
**Trevor:** So,  
**Jason:** Yeah. Some of them make sure they lock away like all their phones and stuff. Yeah. If this if you're sitting in a in the room and this is up and it's like, "Hey, you know, could you record your feelings?" And they slick select a button and then it logs it,  
   
 

### **00:44:51**

   
**Jason:** you know, as part of the session overall, which I would imagine is the intent. I think it's great. I just I didn't get it to work for me, that's why. But yeah, I think it's good.  
**Trevor:** This was one of the things I found out was just running locally on my machine.  
**Jason:** Oh.  
**Trevor:** I was not happy about that. Okay, let me I'm going to throw in a couple more. I didn't test rescue. Oh, yeah, I did, but I'll test it again. and then I got to test adverse. So, I just need to make sure that every one of these things is firing to the database. then quick log. So, these they're really small, so I got to fix the font size there.  
**Jason:** Okay.  
**Trevor:** But these are just sort of like kind of like the the intervention  
**Jason:** Yeah, the quick the quick now buttons are Thank you.  
   
 

### **00:46:05** {#00:46:05}

   
**Jason:** Thanks for designing those in. That was user user awareness,  
**Trevor:** UX user experience Yeah.  
**Jason:** if you will. Oh, yeah. Yeah,  
**Trevor:** Okay. So,  
**Jason:** it's great.  
**Trevor:** we got I got session updates, rescue protocols, additional dose and adverse events which took the companion app.  
**Jason:** Yep.  
**Trevor:** I can see now what's firing to the ledger and what is not. and let's see. Oh, okay. Time. So, some of these are working. all right. And then the export log I'll test that later. Okay, so I just ended the session.  
**Jason:** Yep.  
**Trevor:** so now it becomes a dropdown up here where if they want to  
**Jason:** Oh, cool.  
**Trevor:** review it, they can, but and and they see the timeline, they see the ledgers, and then they've got the close out.  
   
 

### **00:47:02** {#00:47:02}

   
**Trevor:** Okay, so session time ended automatic. Now we've got post session assessments.  
**Jason:** Okay.  
**Trevor:** And I made these optional.  
**Jason:** Yeah.  
**Trevor:** or these two are optional.  
**Jason:** Yeah.  
**Trevor:** but again,  
**Jason:** Top ones required.  
**Trevor:** I'm not really like a big fan of telling them how to do their job.  
**Jason:** Yeah.  
**Trevor:** but I think this is where the MEQ brief is. so we'll go through all three of them real quick. And so begin.  
**Jason:** Yeah.  
**Trevor:**  
**Jason:** When you select,  
**Trevor:** and so here  
**Jason:** sorry, on the previous screen, when you deselect two of them, does the does the count of how many things to fill out go down?  
**Trevor:** I'll double check that because my previous button still isn't working.  
**Jason:** Okay.  
**Trevor:** But All right. So, I'm just going to hit the number two.  
   
 

### **00:47:54** {#00:47:54}

   
**Trevor:** Say three. And here's I'm doing the keyboard. I'm not even mouse clicking and it's auto advancing.  
**Jason:** Oh, cool.  
**Trevor:** So, two, three, and complete. Oh, with that enter did not work. Oh, that's because it Oh, it did auto advance. Nice. Okay, so and I'm checking all of these things.  
**Jason:** Yeah, I like it.  
**Trevor:** here you go.  
**Jason:** This this post wrap-up makes it all just so easy because they're f\*\*\*\*\*\* doing this either in notebooks or some medical system and the or whatever.  
**Trevor:** Okay. So, then it kind of goes and I'm not sure how I feel about this thing here. It feels like a score, but  
**Jason:** Yeah, it should it desperately. Yeah, I know what you're saying. Congratulations. You're below average.  
**Trevor:** you passed. Yeah.  
**Jason:** You're not  
   
 

### **00:48:57** {#00:48:57}

   
**Trevor:** okay.  
**Jason:** dead.  
**Trevor:** But here's here's something cool. okay. So, post session assessments are done. Little here's what the next steps are. continue with integration protocol. We're going to review safety events. That's still not working. and then now we close out the session and go to number three. okay so this this screen here this is phase three. This is the post treatment integration. this is not updated yet.  
**Jason:** Yep.  
**Trevor:** So it's kind of I and what I did is I as I was adding stuff I didn't take anything out that's going away. So a lot of the stuff is is duplicate.  
**Jason:** So, can I ask a quick question here?  
**Trevor:**  
**Jason:** do we need to have this as part of our beta testing? And we I right the the the wrapup or it's just a dosing getting the sessions working because we  
   
 

### **00:49:56**

   
**Trevor:** no.  
**Jason:** could do it in a couple steps or phases,  
**Trevor:** Yeah.  
**Jason:** right?  
**Trevor:** And this as soon as the D these are all working. As soon as the database is hooked up, these will be firing. So,  
**Jason:** Okay.  
**Trevor:**  
**Jason:** Okay.  
**Trevor:** so here's where we have and if you need me to enlarge at all ever, just say so.  
**Jason:** No, it's it's cool,  
**Trevor:**  
**Jason:** dude. Like, I've got to zoom in on my phone or on the  
**Trevor:** okay.  
**Jason:** computer.  
**Trevor:** So, let's see. So, we got neuroplasticity is still all right. Yeah. And again, I haven't gone through this yet since I did the database. So, this is my first pass out all of it. but I'm going to just select everything. and I don't know if you want to look at any of this stuff.  
   
 

### **00:50:47**

   
**Jason:** well, no, no, I I'm going to go through it myself as as well.  
**Trevor:**  
**Jason:** One to just kind of learn everything, but you're you're just walking it through is is great. Viv just texted, so I was momentarily distracted,  
**Trevor:** no  
**Jason:** but yeah,  
**Trevor:** problem.  
**Jason:** it looks really good, man.  
**Trevor:** So, schedule the next session out of there.  
**Jason:** And this will the next session stuff eventually link to calendar invites the ICS link or something I would imagine. So that said could not save just FYI.  
**Trevor:** Oh, it didn't save.  
**Jason:** It said it could not save.  
**Trevor:** Okay.  
**Jason:** It got one of those warning button one in the red warning things that popped  
**Trevor:** Oh, yeah. Yeah. Okay,  
**Jason:** up.  
**Trevor:** good. all right. So  
**Jason:** So these are different surveys and scores than were the ones we selected  
   
 

### **00:51:42**

   
**Trevor:** yeah, and this is what I'm testing is to make sure that that these are  
**Jason:** initially.  
**Trevor:** all like are they going to the database and are they logging in the same place? Some of the stuff may have to come out.  
**Jason:** Cool.  
**Trevor:** probably not on this screen, but and right now, see there's no indicate. It said didn't save. which is to be expected because we're still on phase two for connecting. I'm just going through and looking at everything. And so, that autopopulates. That's good. got some like what changed? I and this this was just sort of thrown in. I don't I don't know how useful or appropriate this stuff is to be in here. So this is kind of why I want to get the the practitioners to chime in and say, "Hey, no, this doesn't need to be here.  
**Jason:** Yeah.  
**Trevor:** Here's the Emmy key." So let's let's start  
   
 

### **00:52:49** {#00:52:49}

   
**Trevor:** here. Oh, my auto advance isn't working anymore. And this All right. So, so these aren't hooked up, but this will have kind of all of the basically these will all be accordians that they the,  
**Jason:** Cool.  
**Trevor:** you know, it'll just look like a file folders and that they they can just go in and look at whatever they want and fill out whatever they want.  
**Jason:** And so it'll condense it  
**Trevor:** Yeah.  
**Jason:** down.  
**Trevor:** obviously this will be over time. So once once they have multiple sessions then this will populate their PHQ9 score and show like okay here's how your systems are looking. So we'll get through all this because none of this is firing yet. Okay. So all right here's what first thing.  
**Jason:** This is all new.  
**Trevor:** Yeah.  
**Jason:** I haven't seen this.  
**Trevor:** So, this is all this stuff is the old stuff, but here's where this is cool.  
   
 

### **00:53:56** {#00:53:56}

   
**Trevor:** I'm I'm happy about this.  
**Jason:** Yeah.  
**Trevor:** So, progress summary is a report that pops up on their phone. This is this is mobile. and it'll have a treatment that they can print out right away or export, you know. let's see if the report looks good. No, still not done. Okay. but this is just a a treatment summary, you know, a progress report. And we can put in anything we want here.  
**Jason:** Yeah, I mean something. Yeah, they they may want to send it to the patient. they may want to post. Yeah, this it's really I mean lots of lots of options, but I like how it's you can print it out.  
**Trevor:** That was a progress  
**Jason:** What? What? That one was the discharge summary or the progress summary.  
**Trevor:** summary. All right.  
   
 

### **00:54:48** {#00:54:48}

   
**Trevor:** Now,  
**Jason:** Okay.  
**Trevor:** this is my this is my new cudigra. Okay. So, the my re when I did the research the the I I also did a separate market study and research on the patient voice of like the what patients are saying publicly about psychedelic therapy. and and I you know I did deep research and then I aggregated and analyzed the results and what what I discovered is that a lot of times they're very anxious going into the session. They do the session and then as soon as they leave they kind of feel lost until the next session. So what I did is I created  
**Jason:** Yeah.  
**Trevor:** a a post session patient facing. So this is a patient page that the practitioner  
**Jason:** There we go.  
**Trevor:** can set up and and this here's what's beautiful. This is customized for the patient. It doesn't have their personal information. They get a unique URL that's tied to their patient ID code which is anonymized.  
   
 

### **00:56:10** {#00:56:10}

   
**Jason:** Yeah.  
**Trevor:** And so now the practitioner can go and choose a bunch of things to to share with them. It's got a reminder like hey this is you know in there it generates  
**Jason:** I gotta say, generate magic link is my favorite part of this because this is a it's magic. So Simon's magic, you know, all this stuff's magic.  
**Trevor:** And this isn't done, but hold on. I  
**Jason:** Yeah, that's really cool, dude. Well, we had talked about that, right?  
**Trevor:** hit  
**Jason:** Sending them something they could fill out and then just gets sent gets re received back under their log as a track. You can build so much stuff when you're interacting and following up with the patients. You can build so much help into that without even having to think about it.  
**Trevor:** Hold on just a second. I want to show it to you.  
   
 

### **00:57:08** {#00:57:08}

   
**Trevor:** because I actually want your input on this.  
**Jason:** Yeah. Let me I'm going to run to the bathroom real  
**Trevor:** Okay.  
**Jason:** fast. All right, I'm  
**Trevor:** So,  
**Jason:** back.  
**Trevor:** I've actually got two versions of these and I I like parts of both of them. So, the plan is to integrate the two. So, I'll show you in both of them, but this is the patient. I didn't show this to you last time.  
**Jason:** no, not let's see. No, I haven't seen this  
**Trevor:** So, here's what's super cool about this,  
**Jason:** part.  
**Trevor:** and I didn't even realize I was going to be able to do it until I started doing it, and I was like, "Oh, wait. I could do this because of the way the database is structured."  
**Jason:** So,  
**Trevor:** So,  
   
 

### **00:59:05** {#00:59:05}

   
**Jason:** I'm seeing two screens to your journeys.  
**Trevor:** yeah. Yeah. So, this is version A on the left and version B. This is the live version right now, but but the I like there's things about them I like in  
**Jason:** Okay.  
**Trevor:** both.  
**Jason:** Yeah.  
**Trevor:** so I'm going to merge the two today,  
**Jason:** Oh,  
**Trevor:** but we'll look at the live one. So, this one just like it's,  
**Jason:** cool.  
**Trevor:** you know, right now I don't I'm not super crazy about this. It's got some mo explainers, but this is static. but this is kind of like this will be where the practitioner can put notes. you know, anything that they want to like show the patient can go right in here in a notes field and then you know  
**Jason:** Huh?  
**Trevor:** like different inputs. Now, here's what's cool. So now without ever having to give their name or set up an account or a password, patients can check in and describe their mood, their sleep quality, and it will update their treatment record automatically.  
   
 

### **01:00:21** {#01:00:21}

   
**Jason:** And this is how did you navigate to this part when this was in the the  
**Trevor:** This is the magic link.  
**Jason:** integration?  
**Trevor:** That magic link.  
**Jason:** Oh, this is the magic link. Oh s\*\*\*.  
**Trevor:** Yeah.  
**Jason:** Yeah, this is brilliant. This is exactly what we talked about.  
**Trevor:** Yeah. So,  
**Jason:** Oh,  
**Trevor:** so now the patient can say,  
**Jason:** I love it.  
**Trevor:** "Hey, I'm in a s\*\*\*\*\* mood today. I but I I slept terribly, but I, you know, I'm connecting." And and they were can record a check-in as as often as they want.  
**Jason:** Oh, dude. This is  
**Trevor:** and then what comes next? So now here,  
**Jason:** great.  
**Trevor:** this is like says integrations where healing becomes real. This is this is your physical, emotional, mental, and spiritual map kind of compass, right?  
   
 

### **01:01:01** {#01:01:01}

   
**Trevor:** And that's why this is a compass up here in the in the background. But this says, "Hey, and this can to totally be customized for every single patient." and basically saying, you know what? Here's your map. Here's your compass between now and your next session.  
**Jason:** dude. This is fantastic. Yeah, this we we discussed this. I think you you nailed it out of the park.  
**Trevor:** Thank you.  
**Jason:** Yeah,  
**Trevor:**  
**Jason:** it's really good.  
**Trevor:** okay. So, all right. I got it back in. Yes. I I wasn't sure if that got Okay, so here is this. we got two things. So, that here's what happened during your session. Here's what happened to your mind and your body. Okay. so, these are all the measurements from a scientific perspective. We're looking at neuroplasticity, DMN quieting, BDNF surge, I don't even know what that means.  
   
 

### **01:02:05** {#01:02:05}

   
**Trevor:**  
**Jason:** No.  
**Trevor:** your dopamine, serotonin, but like patients don't know. So, they can go click experiential like, oh, this is your ego, sensory, emotional,  
**Jason:** Yeah.  
**Trevor:** and they can look at both.  
**Jason:** Yeah. These are all those receptors that kind of that multi-dimensional mapping receptor based on the So these  
**Trevor:** Yep.  
**Jason:** would have to change based on what they were what they were what chemical they're being treated with. So these up these receptors would change if you what if you did multiple things like psilocybin and you did MDMA or you got some DMT bump which which Dr. Allen does regularly which just keeping that in mind whatever subject whatever receptor is tied to whatever substance and if there are multiple they will have to have a map for each.  
**Trevor:** Okay, good to know. actually we could layer those maps in here for each substance.  
**Jason:** That's exactly what it would be.  
   
 

### **01:03:00**

   
**Jason:** Yep.  
**Trevor:** Yeah.  
**Jason:** and Dr. Allen, we'll task him to say because we just got our B I had a whole list of them.  
**Trevor:**  
**Jason:** Remember I said, you know, LSD was this, MDMA hit these receptors. They were all a little bit unique. So there's like eight different unique maps and then they all tie back to these types of words, the experiential versus biological. So this is great. Just having an example is perfect.  
**Trevor:** And this this what this does is it it it br it bridges the science the therapy and the patient's journey in a way that the p that makes sense to the patient and this is 100% driven by what you just said by the indiv individual patient the substances they took it this is all based on their own  
**Jason:** Yep.  
**Trevor:** database records.  
**Jason:** Let me ask you this. Why would we not just have it?  
   
 

### **01:03:50** {#01:03:50}

   
**Jason:** This is this is their journey going to the patient. I don't think you need to have biological on there at all. I think it should default to experiential and maybe even only have that just  
**Trevor:** Okay.  
**Jason:** because they're going to look at bi if it defaults to biological they may not know but man if experential is your  
**Trevor:**  
**Jason:** and then and then they want to look at biological I would say at least default to experiential and if there's multiples then it would have two charts right one selectable for LSD or one for MDMA or psilocybin maybe there's three that they got mixed in they wouldn't know per se but it just pulled up three different charts And that told them, oh, we focused on my ego and my s, you know, that would be I think that would be more useful since this is their  
**Trevor:** Yeah. Yeah, I agree. That's good input. Okay.  
**Jason:** journey.  
   
 

### **01:04:33** {#01:04:33}

   
**Trevor:** yeah, we could do that. And then, this one here is the, pharmocinetic plan.  
**Jason:** Rolls right off the tongue.  
**Trevor:** what Yeah.  
**Jason:** It rolls right off the tongue.  
**Trevor:** Yeah.  
**Jason:** Pharmoconetic.  
**Trevor:** but basically saying what's happening to your body. and so here here's when you peaked.  
**Jason:** Yeah.  
**Trevor:** And so this will show based on all their readings and their vitals what happened during their treatment and then afterwards and  
**Jason:** That's awesome, dude. That's awesome.  
**Trevor:** it'll pull from. So ju this is here during the treatment itself but then it'll pull the data from their check-ins so they can see oh you know my trend line is I've been really having bad moods for three days after I did MDMA you know  
**Jason:** Yep.  
**Trevor:** and they'll be able to see that visually  
**Jason:** So, what's the XY on this?  
   
 

### **01:05:31** {#01:05:31}

   
**Trevor:** represented.  
**Jason:** So, time is the is the the X and then the Y is chest, head,  
**Trevor:** Yeah, it's intensity.  
**Jason:** gut.  
**Trevor:** But this may be a dummy. I have to I have to go and look. because I I mean right now it's running on dummy data. That's for sure.  
**Jason:** I would expect to see intensity on the left,  
**Trevor:**  
**Jason:** but chest, head, and gut, I would expect to see those at some point along the the x- axis rather than part of the like, you know what I mean? So my my chest like there would be like be bullets or data  
**Trevor:** Yeah,  
**Jason:** points along that curve is what I'm thinking,  
**Trevor:** there's supposed to be dots on here. They're just not  
**Jason:** right? That's what I mean. Yeah.  
**Trevor:** there.  
**Jason:** Okay.  
   
 

### **01:06:17** {#01:06:17}

   
**Jason:** So, the legend is probably just needs to be moved. Okay. You're on it. I that I just was  
**Trevor:** No, no, good. It's all good feedback.  
**Jason:** curious.  
**Trevor:** So, that's great. and then here what what I what I did is all right I'm I pulled it back to the business side and my thought is the whole purpose of this was one to you know allow the the tool to extend the arm of the practitioner to beyond the therapy session right like this gives them a way to continue their practice with their patients even when the patient has left their office but here like if somebody goes and they you know they think if they like this and  
**Jason:** Yes.  
**Trevor:** they're showing their friends now they can share it or let's say they move  
**Jason:** Oh.  
**Trevor:** and they you know they've been using this with one practitioner and then now they're going to a new practitioner and that practitioner isn't on the PPN then they can say hey if you're  
   
 

### **01:07:13** {#01:07:13}

   
**Jason:** Yeah,  
**Trevor:** not look at this this is what my old therapist gave me you should be on this this platform  
**Jason:** dude. That's brilliant. And you can post on like imagine some of the big websites like what is it? Third wave. They start we start they they start posting this stuff about their journey or patients journeys and now yeah this is this is fantastic dude this extending the arm this is really great well beyond what I had in mind this is this is cool this is a big this is a big deal man and then if it's automated with follow-ups calendar sesh invites like we put an AI just for the the secretary part of it man that's they're it's gonna yeah that's going to be they're going to love that this is really  
**Trevor:** Thank  
**Jason:** impressive you did Good job, man. Really, really good job.  
**Trevor:** you.  
   
 

### **01:07:59**

   
**Trevor:** Thank  
**Jason:** Yeah, this is Be proud of this one because this will make their lives,  
**Trevor:** you.  
**Jason:** man. Yeah. Yes. I stopped talking, but  
**Trevor:** I Yeah, I was I was like when as soon as like the light bulb went off,  
**Jason:** wow.  
**Trevor:** I was like, "Oh my god, I can customize this so hard that I was like, "Oh,  
**Jason:** Yep.  
**Trevor:** this is this is going to be so I think it's gonna be really well received."  
**Jason:** This is this is a game changer right here.  
**Trevor:**  
**Jason:** Just Yeah, this is fantastic.  
**Trevor:** I'm super excited. I'm glad to hear that you like it because I was I was pumped.  
**Jason:** Yeah, very much  
**Trevor:** so, you know, anything else that we like in here I kind of had this was the original  
   
 

### **01:08:34** {#01:08:34}

   
**Jason:** so.  
**Trevor:** version. some stuff that I want to make sure that anything that we can think of that we want to include you know we'll we'll just push it put it in  
**Jason:** You know, I'm gonna I think I think the one on So,  
**Trevor:**  
**Jason:** I know what you're saying. I like these. You know, the experiential is kind of your default. I kind of want to leave this one to the practitioner. So,  my thought would be to show them what the capabilities are and then have them design the world they want to live in with this follow-up, right? I think that's the way to go about it. and we can show them other options, but I think they'll know they'll know very specifically what they do know, and they'll be surprised at what we can do or what you've got in here that they didn't know is possible.  
   
 

### **01:09:28** {#01:09:28}

   
**Jason:** And I think they're just going to they're just they'll they'll design this one for us  
**Trevor:** Yeah.  
**Jason:** 100%.  
**Trevor:** And then they can before they even get there, they get to choose what they want to  
**Jason:** Right. Yeah,  
**Trevor:** include.  
**Jason:** We may have two or three more things on there or more that we don't even know they need. But I'm trying to save development time. I don't think we need to spend a ton of time here because this is this is like  
**Trevor:** Yeah.  
**Jason:** icing.  
**Trevor:** Yeah. Well, it's built, so I'm stoked on it.  
**Jason:** Yeah,  
**Trevor:** and yeah,  
**Jason:** That's great.  
**Trevor:** So that's hidden. Okay, good.  
**Jason:** So, this was just so I could bet.  
**Trevor:**  
**Jason:** So, that was the discharge summary and that was a companion to the patient link.  
   
 

### **01:10:09**

   
**Jason:** There we go.  
**Trevor:** Yeah.  
**Jason:** Cool.  
**Trevor:** Okay.  
**Jason:** Wow.  
**Trevor:** So, I know, right? I'm super excited about that.  
**Jason:** And and and they they'll have an email or something for that patient that they'll put in or a phone or  
**Trevor:** So it it will go it'll go to an export like a share button just like on your phone with you know when you hit share and you can airdrop it or you can email it or you can text it like on any device it'll that's it'll just it'll activate the the devices share  
**Jason:**\-huh.  
**Trevor:** function. but it also had this copy. so this is actually supposed to be shared, not copied. and then you would get your you know, it'd be the same thing as if you hit you know, the you know, on your phone, the little square with the arrow pointing up.  
**Jason:** Yeah, let me ask you this question.  
   
 

### **01:11:08** {#01:11:08}

   
**Jason:** So if I go through and clearly this is linked, it's a hippo question. If we got their their journey, we got the link and then I hit share and then I'm typing in this person's email address. So now I have this anonymized patient journey, but now I'm identifying either their phone number or their email. do we just want to send it to the doctor and then have the doctor forward it on to  
**Trevor:** Well,  
**Jason:** them?  
**Trevor:** So this is a great question.  
**Jason:** Any violations?  
**Trevor:** this is on the doctor's device, but it goes directly from the doctor to the patient. It never goes to the database.  
**Jason:** Oh, okay.  
**Trevor:** So,  
**Jason:** Okay.  
**Trevor:** This is a query. It's it's just a really fancy query that that queries the patient record based on  
**Jason:** Okay.  
   
 

### **01:11:58** {#01:11:58}

   
**Jason:** Cool.  
**Trevor:** their ID number. We never know who the patient is.  
**Jason:** Awesome. Okay.  
**Trevor:** So this is really it I created the ability for the the doctor to share whatever they want with  
**Jason:** Cool.  
**Trevor:** the patient from the system without giving us the patient's information.  
**Jason:** Okay, cool. Cool.  
**Trevor:** I'm really proud of that. I'm glad you like it.  
**Jason:** Dude, this is extending the arm like you I like that wording,  
**Trevor:** Ah\!  
**Jason:** Too. This is when we were kind of talking about automating follow-ups and stuff. This is that on it's MVP plus for sure. For sure. This is great.  
**Trevor:** the rest of these are kind of the same stuff.  
**Jason:** Okay.  
**Trevor:** Here I'm going to just enter in the daily pulse check.  
   
 

### **01:12:48**

   
**Trevor:** integration.  
**Jason:** That could not be saved.  
**Trevor:** Yeah, none of this would save.  
**Jason:** Oh, good job.  
**Trevor:** but I am like these are not color  
**Jason:** So,  
**Trevor:** accessible.  
**Jason:** So from a from a testing standpoint, thank you for showing me that new stuff. I was going to ask what time it is a little after 12\. I was going to ask I want to go through and is it feasible that I go through create a journey and then or kind of go through this whole thing run the flow because one I want to learn all the new stuff but then the next use case right would be then to go back in and edit you know what I what I sent or the the what do you call it the the record or create a session a second session tied to that patient right because maybe they'll have One patient could have five different visits over the course of several months.  
   
 

### **01:13:48** {#01:13:48}

   
**Jason:** That would be the other use case. So,  
**Trevor:** Yes,  
**Jason:** I can go in and test all those.  
**Trevor:** Exactly. So, no, not yet. So, that's what's happening today.  
**Jason:** Oh,  
**Trevor:** So,  
**Jason:** Cool.  
**Trevor:** what was what was happening before was and the reason that I had a list on here and you didn't and I couldn't figure out why was because it wasn't actually in the database. It was just saving to my machine. So, in the future,  
**Jason:** Oh.  
**Trevor:** like as soon as it's all connected, when you go in here, so right now I have it. Oh, okay. So, it just popped back into that same Oh, because I haven't closed it out. let me show you this last thing. The discharge summary.  
**Jason:** Oh yeah.  
**Trevor:** discharge summary here is the this is a just right now it's just a textbased report that looks like this but we can this can be whatever we want it to be and my thought here was we can we can create a CSV or something that integrates with whatever EHR system they're  
   
 

### **01:14:58**

   
**Jason:** Nice.  
**Trevor:** And we can even create some automation that automatically takes everything from the PPN portal and drops it into Epic or whatever they're using. I don't know about that. That's obviously down the road. But this is just sort of a the ability to create a an an export  
**Jason:** Yeah.  
**Trevor:** report. So there'll be a polished version. There's so this is what that looks like. there's this is the polished version that can be  
**Jason:** Yep.  
**Trevor:** printed or looked at on your phone. there's the patient version that you just saw. And then this will be basically whatever we want to  
**Jason:** And then is this one the like the CSV version that potentially TBD on the the import to you know whatever EH R system they have is this where  
**Trevor:** do.  
**Jason:** the insurance benefits ch you know kind of come in it's like okay now you have tracking of all this stuff what they went through what was administered is this that outside of an EHR system and inside of  
   
 

### **01:16:05** {#01:16:05}

   
**Trevor:** I'm so glad you asked. so that is right now just a summary, but down here we've got an export function where we can customize an audit report, an insurance report or research report. and I don't think that I'm not even let's see if these are working now.  
**Jason:** Yeah, I don't know that we'll have it necessarily available more. I was just understanding some of tying back some of our other combos on things where it would play out. So, it sounds like this would be the area for that.  
**Trevor:** Yeah. Yeah. So, okay, they are working. so yes, finally. okay. So the insurance report this is for billing  
**Jason:** Yeah.  
**Trevor:** Right.  
**Jason:** Oh,  
**Trevor:** this one is clinical just this is the discharge  
**Jason:** Cool.  
**Trevor:** summary. this is if they get audited right so this was based on the state of Oregon audit requirements for still practitioners.  
   
 

### **01:17:21** {#01:17:21}

   
**Trevor:** and I haven't I haven't QAed this yet,  
**Jason:** Cool.  
**Trevor:** But but this is kind of the big pain point for the like what Sarah was talking about and how people aren't. She said that people aren't using that system. She's like the only one. Well,  
**Jason:** Yep.  
**Trevor:** Now if they use the system for the treatment, the reporting is done for them and they can just boom export.  
**Jason:** Yeah.  
**Trevor:** It's done. They got to sign it and all of their compliance is taken care of.  
**Jason:** That's that's fantastic,  
**Trevor:** So,  
**Jason:** bro. I mean, effectively it's the doctor and patient focus.  
**Trevor:**  
**Jason:** I'm kind of in my head dividing these into pillars for, you know, our a pitch deck or something, right? You've got you've got this one system and on the front end of it, it's it's health assessing, it's patient focus, what do they need?  
   
 

### **01:18:13**

   
**Jason:** Then you're in session. This next column is over, right, which is the dosing and and the event tracking. And then it's, you know, coming out of that session, it's the patient follow-up. But that's like that's like one pillar subdivided three ways. And then the next pillar over, right, is going to be you know, your clinic or your overall management. And then you have ex sort of the external administrative type stuff, reports, insurance, and whatnot. So it goes through a full spectrum of patient to administrative requirements and it simplifies it all for the practitioners which and it's easy. Then they'll put in data and data quality goes up and that is the whole purpose of this.  
**Trevor:** Thank  
**Jason:** So yeah it's it's it's really good.  
**Trevor:** You.  
**Jason:** Yeah. Okay.  
**Trevor:**  
**Jason:** I like it.  
   
 

### **01:19:02** {#01:19:02}

   
**Trevor:** the next thing I did, and yes, you hit the nail on the head and you articulate it really well. So, I'm glad we're recording this because that can that will help when we're doing things like marketing and stuff. So, I was like,  
**Jason:** Yep.  
**Trevor:** "Okay, well, I don't want the doctors to have to go and hunt for all this stuff." So, I created a download center and and now they can get all of their reports in  
**Jason:** Oh. Oh, perfect.  
**Trevor:** one place.  
**Jason:** Brilliant.  
**Trevor:** and so they can export clinical records. They can go and look at all it like they've got a whole just a whole slew of different things that they can do for on a patient level, on a clinic level. And I haven't audited all of these that's coming.  
**Jason:** Yeah.  
**Trevor:** But now they've got a one-stop shop for all their  
**Jason:** Yeah.  
   
 

### **01:19:56**

   
**Trevor:** reports.  
**Jason:** I like  
**Trevor:** And then some of the stuff like they can do let's see if this is working.  
**Jason:** it.  
**Trevor:** no. you know, eventually my thought was to give them the power to send some of this stuff to the patient in advance and have it get loaded.  
**Jason:** Yeah,  
**Trevor:**  
**Jason:** Now we're getting into the screening stuff for the biocsych socials that Bridger was talking about. Yeah, it's  
**Trevor:** Yep. so we'll get all this stuff dialed in,  
**Jason:** Great.  
**Trevor:** But it's all set up. And and that those are kind of the things that I was really excited about that really I what I felt like rounded out the tool to to truly span the whole arc of care.  
**Jason:** Yes. Arc of care.  
**Trevor:**  
**Jason:** Yes.  
   
 

### **01:20:51** {#01:20:51}

   
**Jason:** And the administrative arc. It's really Yeah.  
**Trevor:** Yeah. So, I put a link to that and go  
**Jason:** Can I make one?  
**Trevor:** ahead.  
**Jason:** So on your so because we kind of have we have that flow that we were talking about like the the incoming the patient the outgoing administrative I think we need to we could probably this is detailed but we probably could move audit and download center to like a little lower with like administrative type line substance library up higher kind we could almost put the put this menu on the left in accordance with the flow of what we were just talking about on that x- axis over time. Yeah.  
**Trevor:** on the sidebar here.  
**Jason:** Yeah.  
**Trevor:** Yeah. Yeah. yeah, it's set up right now kind of I set it up the way that I thought sort of what they would you know so when they when they land there's they're supposed to come and ignore this.  
   
 

### **01:21:48** {#01:21:48}

   
**Trevor:** This is coming out at the bottom. when they land it. This was the original request to have it start at the search, right? and if we want to change that, we can, but so I had this at the top and this is where when they log in, their cursor is in the search bar.  
**Jason:** Is that the default landing page now is search not  
**Trevor:** And so,  
**Jason:** dashboard?  
**Trevor:** start page. Yeah. Yeah. and that was really just because I remembered that from the very beginning was what you had asked  
**Jason:** Yeah. Well,  
**Trevor:** for.  
**Jason:** It's normal that it was originally the simplistic version of what this ultimately blew out of the water, right? when I logged in, it did take me to the dashboard originally. So, I'm wondering when you do your first log in, does it go to the search one or does it go to the dashboard one or did you change it?  
   
 

### **01:22:39** {#01:22:39}

   
**Jason:** I guess all I'm asking.  
**Trevor:** It is I. I yeah I change it.  
**Jason:** Oh,  
**Trevor:** It goes to search now and it it activates the cursor in the box  
**Jason:** Cool.  
**Trevor:** Here.  
**Jason:** Sweet.  
**Trevor:** so like I'm typing in ketamine and it shows me all the things that ketamine, you know, and this is not hooked up to any AI yet. we have to talk about that because depending on the sophistication we want to install the cost changes.  
**Jason:** Oh yeah.  
**Trevor:** but right now this is you know it'll search everything locally you know however we want. dashboard I trimmed this down so it just shows some stats and the quick actions.  
**Jason:** Yeah, that's way that's much better. Much cleaned up.  
**Trevor:** That's Yeah.  
**Jason:** You got rid of the redundancy.  
**Trevor:** And then analytics cleaning up as well, but not done yet.  
   
 

### **01:23:33** {#01:23:33}

   
**Trevor:** And then really that's it. Like  
**Jason:** Sweet, man. Wow, man. It's really coming together, dude.  
**Trevor:**  
**Jason:** Don't you? Is this just like Isn't it just like dopamine squirts? I mean, watching it work, dude. It's like It's hard to say settled. I mean, it honestly  
**Trevor:** Yeah.  
**Jason:** is.  
**Trevor:** Yeah. Yeah. For sure. the temptation to keep adding stuff that I know I can do is very real.  
**Jason:** That's called gold plating. We'll hold off. Just make notes.  
**Trevor:** But so as soon as let's go back to the original thing that we were talking about about the MVP. Okay. And so now I'm seeing that my wellness journey is still going. So interesting. I thought it would close out because now how do I start a new one?  
   
 

### **01:24:25**

   
**Jason:** Right.  
**Trevor:** so I'll make a note of that.  
**Jason:** Yeah,  
**Trevor:** And  
**Jason:** it's it's stuck in phase three  
**Trevor:** Yeah.  
**Jason:** Basically.  
**Trevor:** And I think oh okay. So now see my path. These are all my test cases now.  
**Jason:** Oh, cool.  
**Trevor:** so but still it should have started over if I had closed out the session.  
**Jason:** Yep.  
**Trevor:** And then oh yeah, so I got my most recent entry here. I got my little playground. we got to figure out this if we want to use it,  
**Jason:** Yep.  
**Trevor:** If I want to disable it. I have my wristband from when I was in the hospital last week. so I'm going to be I'm going to try and get that working,  
**Jason:** Oh, cool.  
**Trevor:** but I don't know if that's it's probably going to just probably going to disable that for now.  
   
 

### **01:25:19** {#01:25:19}

   
**Trevor:** oh, okay. So, this is in my resume. Perfect. Okay. I just actually just added this feature or just activated this this morning. What I didn't do was activate how to shut it off. So, if I go on a wellness journey, I just need to go to this screen. Ah, okay. There's a bug right there. you see what I just what just  
**Jason:** Yeah. So it had it part of it had open part of it had  
**Trevor:** What happened? Yeah. So,  
**Jason:** closed.  
**Trevor:** It went and started a new one after so it was showing me all my existing ones, but then when I exited out now, I went and it looked like it shut it off. So I just got to figure out the the shut off mechanism there.  
**Jason:** Yeah. and the most recent. It grades that out.  
   
 

### **01:26:10** {#01:26:10}

   
**Trevor:** Yeah.  
**Jason:** Cool.  
**Trevor:** Yeah. Okay.  
**Jason:** Well, this is exactly it. So, that's that's yeah,  
**Trevor:** So  
**Jason:** Those are the use cases and finding these out. And even though clunky, Yeah, we 're right. I think we're really close to getting this in front of Dr. Allen. Like, we should know he's back tomorrow. I'll reach out. I mean, you know, I'll reach out and maybe try to get something. Actually, I need to get him a phone call. But try to man it would be great if we could do something this week, right? Are you on the same page?  
**Trevor:** My goal is to like to have this done by this afternoon. Like let's identify the things that like hey we we have to figure this out and we identified a lot of them right here  
   
 

### **01:26:51**

   
**Jason:** Yeah.  
**Trevor:** in this conversation. and if we can if I I'll prioritize those items and once we get them done,  
**Jason:** Yep.  
**Trevor:** we'll test it and and then and then you know he can start testing and and I think we like we tell him,  
**Jason:** Yeah.  
**Trevor:** Hey, play with it, see if it works for you. Don't you know we're not claiming that it's, you know, field ready,  
**Jason:** right?  
**Trevor:** But you'll be with one of the people to tell us how close it is to the field ready.  
**Jason:** Yes.  
**Trevor:** So my goal is I would love to have this in his hands before he's on the ground.  
**Jason:** Oh,  
**Trevor:** you know,  
**Jason:** Okay.  
**Trevor:** like because Oh, that takes me to the next thing. How are we doing on time on your  
**Jason:** I've got some. I've got a phone call at one.  
   
 

### **01:27:37**

   
**Trevor:** side?  
**Jason:** so I've got probably 10 minutes so I can prepare. my buddy Oh, Brian, you know, Brian, he got the Let's see. What did he say? He just sent it over. He got the the party of, let's see, he basically he's going to be running supported by the Oregon House Republican chair. So, he's got their support. So, I've got a meeting with him to kind of talk over next steps to help his candidacy. So, you got me for another 10, but I'm only meeting with him for a little bit.  
**Trevor:** It's  
**Jason:** and I'm with you 100%.  
**Trevor:** Okay.  
**Jason:** Like, make some of those changes and let me go in and I'll document the use cases. and then we can talk with Dr. Allison over, hey, here's a use case just at a high level, right?  
   
 

### **01:28:26** {#01:28:26}

   
**Jason:** Just create a protocol, update a protocol, and if there's any major stuff we just can't get fixed in that, then we can just flag it and so he doesn't have to double capture it. But yeah, I'd love to have it done today. I'm with you 100% and I'm available this afternoon to test. So,  
**Trevor:** Sweet. I also added this up here. Can you still see my screen?  
**Jason:** yep.  
**Trevor:** so everywhere they can go in and report a bug.  
**Jason:** Oh,  
**Trevor:** And,  
**Jason:** Cool.  
**Trevor:** what this is going to do, they can request a feature, they can send a note, or report a bug. And report a bug. I think what it'll have it do is capture their console to find out where the bug is happening.  
**Jason:** Oh, okay.  
**Trevor:** and that's like that'll make things really easy because a lot of times when there's a bug and I have to go in here and diagnose.  
   
 

### **01:29:21**

   
**Trevor:** See here all the things that are still not working.  
**Jason:** Yeah.  
**Trevor:**  but that's to be expected.  
**Jason:** Yeah. That's a good little feature. Yeah. I think we'll have to do that actually it'll be a good impetus if we already get able to get this over to him tonight or early tomorrow. and then say, "Hey, you know, when you get a minute, you can start wrapping your head around." We'll just go through the basic kind of a training session with him.  
**Trevor:** Yeah.  
**Jason:** and then let him run like the bug reporting for example. He'll want, you know, we want to show him how to do that properly. but yeah, I Yeah, I like the stretch goal, dude. I had to go for it.  
**Trevor:** I do have already I had  
**Jason:** It's  
   
 

### **01:30:02** {#01:30:02}

   
**Trevor:** Gemini create some video scripts for me. And what I'm going to do is video tutorials for every screen.  
**Jason:** perfect.  
**Trevor:** and I what I'll do is I'll just walk through them and you know kind of follow along with  
**Jason:** There you  
**Trevor:** the script.  
**Jason:** go.  
**Trevor:** But that way if they don't want to, you know, get help, like they just want to see the steps, they can just go in here and they'll be able to say, "Oh, you know, how does the wellness journey thing work?" So,  
**Jason:** Yeah,  
**Trevor:** I've already got placeholders in  
**Jason:** That's that's awesome.  
**Trevor:** Here.  
**Jason:** Excellent. And then do I have how do I know I have the latest live version? Which link am I clicking on?  
**Trevor:** I haven't pushed it to the web yet because it's not working,  
   
 

### **01:30:49** {#01:30:49}

   
**Jason:** Okay. Okay, I'll wait for that  
**Trevor:** but I I can get I'll get this what I have so far pushed  
**Jason:** Then.  
**Trevor:** out right away. And I actually this morning was right before we got on this call. I was testing the login and registration. The whole like multiple sites part and that ended up being a lot more complex than I anticipated because I ended up having to reorganize how patients were created based on how the users were created based on the user and location. And then I was like, well, how am I going to have them register a location? So, this still has to be tested, but let's see what happens. oh,  
**Jason:** Okay.  
**Trevor:** It's still on invitation only. But now there's a screen where they have to enter their name and they have to say I'm part of an existing clinic or I'm a solo practitioner or I want to set up a new clinic.  
   
 

### **01:31:57** {#01:31:57}

   
**Trevor:** And all that had to happen before we could properly have the patient IDs fire.  
**Jason:**  
**Trevor:** which ended up like I was like, "Oh, I didn't even think about that." It's just, you know, it's something I discovered.  
**Jason:** Yeah.  
**Trevor:** So, anyway,  
**Jason:** Okay.  
**Trevor:** It will be for somebody like Dr. Allen who's already got a login, you know, I kept him in there. even though I ended up, you know, pulling yanking it and saying, "We're not ready." he will be able to test it without having to set up a new account. But we're going to have to we're going to have to rigorously test the brand new user  
**Jason:** Oh,  
**Trevor:** just discovered us has never known us and wants to sign up that flow. We're going to have to test  
**Jason:** yep. Yeah. Cool. Yeah, dude.  
   
 

### **01:32:44** {#01:32:44}

   
**Jason:** This is awesome.  
**Trevor:** that  
**Jason:** I can't wait to. I mean, yeah, do what you got to do and let me know. Like I said, I just have my meeting at 1, probably two, I would say. and then just keep me in loop on what you got going and I'll jump in simplifying it down to just basic functionality, not all the details because I think we'll flush those out over time. Yeah,  
**Trevor:** Sweet.  
**Jason:** looks good.  
**Trevor:** Anything that you think of that comes to mind that you're like, "Hey, oh, you know, we I forgot we really need to have this in version one." let me know. But really, what I'm doing right now is I'm just tightening up what's here.  
**Jason:** Yeah,  
**Trevor:** And I'm I'm if if it can't be tightened up in a day or two, I'm dropping it right now.  
**Jason:** I'll stick with that.  
   
