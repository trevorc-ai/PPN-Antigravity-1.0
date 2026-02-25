# **dr\_allen\_demo\_2026-02-24\_Edited**

Let me know when you can see my screen. 

**Dr. Jason Allen:** I can see your screen. 

**Trevor:** You see molecules? 

**Dr. Jason Allen:** I sure do. Ketamine and MBMA. 

**Trevor:** All right. Okay. 

**Dr. Jason Allen:** This been when you got there? 

**Trevor:** So this is for you, science, science minded folks. I understood this was important and if you need me to enlarge anything or anything like that, just let me know.

But what I did was created a library of 10 different substances and we've got ketamine you know, psilocybin, LSD, A couple two, the two types of DMT, ibogaine, mescaline, and down to ayahuasca. Just some kind of cursory information on the top here. But then what I did do is I did a scientific page here.

That really does a deep dive. So let's let's look at LSD. Over here on the right, we've got all of your, your various receptor bindings and information. Just this is all publicly sourced data and it, everything has citations and then down here, you know, so kind of the top stats just the things that people would want to know.

And then we've got some deep dives in here. So the mechanism, safety, contraindications, drug interactions, efficacy, and each one of these has citations down at the bottom where you can find the source information. So. I, if you wanna look at a particular one, just let me know. I'm gonna kind of ble blaze through this 'cause I have a lot to show you, so please inter interrupt me with questions anytime.

And you know, we've got drug interactions, efficacy trends, which we will have in here. What we'll do is we'll be showing the well we can actually do it a bunch of different ways, so I shouldn't say what we're gonna do. I'm gonna, I'm gonna ask, but after we get through the tour, we can configure all of this 'cause I custom built all of this stuff.

Some of the technical things. And then right down here we're going to put in an AI deep dive if, if people want it. So if they want to like, oh, okay, I see something on here. It gives me an idea, I'm gonna ask about it. So this is the substance library and you know, for instance, like the ayahuasca.

It's got a little bit more going on. I know you said you work a lot with ketamine. 

**Dr. Jason Allen:** I'm actually kind of curious which receptor affinity you have for Iboga in there.

**Trevor:** And I just updated these yesterday. I have not QA them yet. But feel free to ask away and I'll show you just what would you like to see? 

**Dr. Jason Allen:** Well, I I what outta curiosity? I'm doing some pretty intense research on igan and it's it's, there's not as receptor, it's not known to effect yet due to the, the widest spectrum neuropsychopharmacology, 

**Trevor:** right?

So this if you look here in the center, this is basically, and, and this is spider graph is indicates it's very little, very little impact at all. And again, I haven't QA this data, but it is publicly sourced. But as opposed to like something like LSD 

**Dr. Jason Allen:** Yeah. 

**Trevor:** Where you could see a much 

**Dr. Jason Allen:** five HT two A.

Yeah, 

**Trevor:** yeah. You see a much broader range there. So this is really just, all this is doing is aggregating the data that is publicly available. And then and, and I'm gonna give you a login so you can go in and play around with this and, and say, Hey, I like this. I don't like that. I'm, I built this for you and for your, your colleagues.

So I am not attached to how any of this is laid out. You're not gonna hurt my feelings. You guys are doing amazing things. And that's what I'm here, I'm here to help. These are some filters here. Just the people wanna look at particular kinds. And then I put in a molecular pharmacology, molecular bridge stats.

Again, all this stuff can be filtered and played with. So whatever you want to see. And then I did find a nice little algorithm for a binding affinity matrix that I thought was pretty cool. 

**Dr. Jason Allen:** Oh, very cool. 

**Trevor:** And all of this can be, I put tool tips and citation sources everywhere I could. Got a filter up here for all kinds of things.

You know, so I, I had to stop putting features in, 'cause this is, I'm, you know, I was an analyst for a little, a long time out college. And so this is, I had a great time with this. And I don't know if Jason told you my personal story, but I, 

**Dr. Jason Allen:** no, he didn't. 

**Trevor:** Well, in a nutshell, I, I would say that MDMA therapy saved my life.

**Dr. Jason Allen:** Okay. That's a good summary. 

**Trevor:** And I don't think I'm overstating it, so, okay. Anyhow that's, that's the that's the molecular library, that's the substance library. If people want to do a deep dive in the chemicals, and we can certainly add to that. The, the next thing that I think is really important is I, you know, I explained how I was able to figure out a way that we can track your treatments over time and can, and do it in a way that remains anonymous for the patient.

So I've. Stress tested this against all HIPAA standards, and basically we took everything except the personally identifiable health information and, and put it in here, and we left everything out. And then I created a mechanism for an encryption key that allows the practitioner to go in and basically track patients over time.

And and these all say unknown because I ha I was, I'm testing right now, but if you look at, basically this is, and I named this after you, just so I could Oh, 

**Dr. Jason Allen:** thanks. 

**Trevor:** But normally the, this is what, let me this is what the, the patient name looks like. It's just a randomized 10 digit alpha numeric encryption, and it cannot be hacked.

We don't ever collect. The patient information. So, and no, nobody could ever steal it from us. And all of our data on the tables is pulling from reference tables. So there's, I'll show you the backend when, when we look at it, but when effectively you know, if you want to go in and look at a patient's treatment for kind of the same thing you know, what did you treat 'em with?

Here over on the right, and as you can see, the the patient's, this is the patient's id 45-year-old male. We actually have a weight range in here, so I don't have to put their specific weight if we want. And then some information on what was the environment like and we're, all of this stuff is in the tracking that I'll show you in a minute.

You know, was there prep before the therapy before the dosing session? Was there integration afterwards? Was there music how many practitioners to patient ratio? What was the environment like? Was it clinical? Was it a retreat session? Was it at home? So I basically took as much information as I could get from you and your what you shared, and then aggregated it with different types of metrics and aggregation, like analyses.

So we'll get into that more. But right now, this is dummy data, but what this would show would be the patients, in this case, the PHQ nine score over time. So in the, this one only has two data points, but the first session, they were at a 25 second session, they were at a 12\. Okay. And then down here would be similar patients with similar treatments of your, in your care who had however we wanna match them.

So this would just sort of be like the export after a treatment session if you wanted to print this out and put it into patient's file where it's just and this is just a sample but let's get into the real good part. So this was the most challenging part, and I had, I had a great time with it, but I called it the wellness journey.

But this is basically your treatment. This is from when they walk into your office until when they leave your office. And I separated it into three phases. The, the prep, the treatment, like the dosing treatment would be the dosing, and then the integration would be the post. So, any questions so far? 

**Dr. Jason Allen:** No, it looks great, Trevor.

**Trevor:** Okay, so one thing that I learned on the way was you know, obviously we've got, we've gotta make it easy. People have gotta use it. So the, the goal here was to make it as fast as possible and the fewest number of inputs or taps or clicks or any of that. So like, my, my goal is to streamline this and, and in some cases, I think I mentioned I've got it down to like 14 seconds for somebody who's familiar with the form.

Great. But, so this is an, in just a kind of a splash page at the beginning for the first timer, Hailey, here's what to expect. You're gonna get three phases and you're gonna have to work on all of them. And then of course, you can check this so you don't have to ever see it again. But that way if you've got multiple people you know, using the system, they, the, the new people can kind of get the, the, the lay of the land.

And by the way, this is primarily designed for tablet, so. Okay. You'll, you'll see it laid out. I really did. I did it. Maybe make it mobile friendly. 

**Dr. Jason Allen:** Is that iOS or tablet or Android? 

**Trevor:** It'll be both, but yeah, I, I test it out on my iPad. A a small iPad.

So, first thing here you know, this would be the first thing you, when you clicked on that wellness journey, if you had decided you didn't wanna see that first page, this would be the first thing you'd see. And you could choose a new patient, existing patient, or you can scan the patient's wristband if you've got them in a clinical setting.

Haven't hooked this up yet, but we could also do it where we assign, right here, we assign that random 10 digit. Oh. But you have options on how you decide on that patient. The second screen here is I also recognize that not every practitioner practices the same way. You, for instance, would be a clinical setting.

Some people are more in a ceremonial like religious setting. So I allow for some basic like presets. Or you can come over here and customize all the different things that you are doing. And tell me if you can read that or if you need me to enlarge anything. 

**Dr. Jason Allen:** Yeah, no, that's good. 

**Trevor:** Okay. So again, all of this is very easy to customize.

So let's say, you know, somebody wants or not, you're gonna use the me Q 30, like just uncheck it and they won't see it. And that way people can reduce the cognitive load as much as they want.

So I'll stick with the the clinical, just unless you want me to look at anything else. 

**Dr. Jason Allen:** That's good. 

**Trevor:** And, and then now we're gonna go into, all right, we're gonna set up the patient. What are you treating 'em for? Let's say we're gonna treat this per patient for PTSD, and he's 53 and he weighs 222 pounds.

And just put in kind of the basics. That's it right there. To start. So this sets up the patient with the basic characteristics, and they've already been assigned that random hash id. This is, this is their patient. Id totally alphanumeric. Totally.

**Dr. Jason Allen:** Just, just real quick here, Trevor, of course, to be a minutiae, we will often con, if there isn't an auto, conversion between pounds to kilogram. We'll make that mistake you just did. 

**Trevor:** Yeah. And so I'm, I'm so glad you asked because it's actually, what that's gonna be is a dropdown box by a kilogram range. So it's gonna be 175 to 170 to 175 kilograms, 175 to 80 kilo, 180 kilograms. I'm so glad you asked that because almost everything is a dropdown box, but I am, I'm, I'm tweaking and, and refining these, and sometimes I just gotta put it in because going to, I hook it up to the database later and then I switch it out.

**Dr. Jason Allen:** Okay. 

**Trevor:** But great question, and please keep going with those because you, you're probably gonna bring in something that I missed. A lot of these screens to start, have a, a little tour that if somebody wants to learn like, what are you, what's going on on this screen? They can click a compass. Anywhere you see a compass.

You can get something more in depth than a tool tip. But this is phase one. Phase one has four steps, which is all your prep. And I'm gonna be looking to you for refinement on how we sequence these. But it, you know, you would just pop into this screen here and you would start, and the first thing we ask for is verify that you've got informed consent.

And then you can also add different types of consent forms that you have on file if you want. And the idea here being like, people can defend this to insurance or to the authorities or in court or whatever, that like everything's being tracked and everything's anonymized, but they can still prove they're doing it.

**Dr. Jason Allen:** Is there an ability to upload into this? 

**Trevor:** Yep. 

**Dr. Jason Allen:** Right here? 

**Trevor:** Yep. 

**Dr. Jason Allen:** If I do have those consents, there is a file upload. 

**Trevor:** When you say there is a file uploaded, what, what do you mean?

**Dr. Jason Allen:** The, on the previous screen, all I have is a click that I have consent. Is there an, is there a place for me to upload an actual form into a file?

**Trevor:** So we're not storing that? We are storing the treatment. You store your health records. I'm not if, if we wanted to build a true EHR system, we would have to go and we would have to be, you know, we would've to design HIPAA and, and all, all that. So what this allows you to do is say, I have this, I have it on file, and I can try, I can tell you when I acknowledge that I got it.

And all of this is for tracking and reporting and analysis and defensibility. This is not to store your records, it's to complete your file. Okay. So going back just to boom, boom, you know, we've got these, and then the next thing is and again, pay no attention to kind of like the layout. We can, all this can be customized, but I just wanted you to see the things that we're tracking in here f to allow, to try to accommodate as many practitioners as possible.

So here this is you know, what is their Columbia suicidal severity rating safety concerns for you know, what, what has been going on prior to treatment. 

**Dr. Jason Allen:** Mm-hmm. 

**Trevor:** And let's just say they were having, you know, isolation and panic attacks. What sort of adverse events were they experiencing? Can you see these dropdowns?

**Dr. Jason Allen:** I can since we're not saving anything, if we click other. Is there a place to input any information? Is this only gonna be dropped down and click? 

**Trevor:** So what we're gonna do is we are going to we're gonna add to the, there are virtually no text boxes that you can type in, but what we're, what I put in here is a predictive an text analysis aggregator.

So everybody who uses the system can say, Hey, I wanna request that you add something to this dropdown box. And, and then as soon as we get a statistically significant number of requests, it'll automatically add it to the table to that dropdown. 

**Dr. Jason Allen:** No kidding. Trevor, that's pretty AI of you. 

**Trevor:** Thank you. Nerdy stuff.

So to answer your question, the answer is yes and no. But the whole point is so that, so in order to protect ourselves from HIPAA liability. We have to pre prevent the possibility of people entering in private information, personal information. And so the way we do that was we control the inputs.

We control how things are stored in the database, and so here we go. Severity of the, that other you know, whatever you want, it doesn't matter. And then are they on medications? So in this case, I'm gonna, I'm gonna say the patient's on lithium because I the reason for that, but you can add as many medications as you want.

And then what have they been through in the past in terms of like, were they hospitalized? Did, did you know, maybe this was either leading up to your treatment or, yeah. Again, very customizable. Is there a follow up required? Let's say Yes. We ask when and then save. And you might notice over here, that was the second screen.

We did the informed consent and we just did the safety. So we're clicking through all the steps automatically. 

**Dr. Jason Allen:** Okay. 

**Trevor:** And then real quick here, we've got options for maybe if one practitioner tracks pq, nine a different practitioner tracks gad. Another one tracks Ace. These are all optional, so they can track it if they want, they can leave it blank.

And then my, my vitals are on this page, but here we've got heart rate, we've got blood pressure, and then

the last screen of phase one is what is the patient expecting? Do they have. Are they not really, they're not really that big believers in it. Up to moderate to high belief, and you can score that that was a request from another practitioner. And then kind of same thing, motivation level. What kind of support system do they have?

Prior psych psychedelic experiences. And there's other ones too that I haven't even put in because I'm trying to balance the overload, but like, did you track whether or not they have transportation home And anything that you want in any of these four steps we could put in including like you'll see in a minute you talked about what's their severity of perspiration and all of that.

So phase one. Done all four of these boxes. Now say complete. If we had stopped in the middle for any reason, one, they would be still highlighted and they say, complete these. And then you've got confirmation that you've got all of your compliance documents right here. These are placeholders for statistics or anything that we want to put in here.

I left room or we can just take 

**Dr. Jason Allen:** on baseline. On baseline. Can you add EKG in there? That's pretty, pretty normal. 

**Trevor:** Yep. Yep. If you enter it, we'll, we will display it. We, we can track it and not display it, but you'll see this, you'll like this next part. But yes, EK, G. So this was more just the setup to treatment and it was based on what I could tell from research.

So if you say, Hey, that doesn't belong here, or, you know, this is outta place or not necessary, we'll take it out. So right away, because I had lithium in there, and in this case the, the treatment was already set. This, so this is dummy data because there was a contraindication. This obviously is pops up.

In this particular example, I had not yet entered the dosing protocol, but we're playing with dummy record. So the first card of the phase two is what are you gonna treat 'em with? In this case, we'll, you know, whatever you want to put in here. And and oh, over here you can, with your dosage, you can do milligrams, grams, micrograms, milliliters or drops.

Again, we can add to that if you like. How are you delivering it? And then over here we talked about potentially if, if there was. If we wanted to start tracking sources, we could do that later. We also have, if you want to, if you have a patient with a wearable, like an Apple Watch we've already installed the integration so we can let all of their vitals be taken throughout the session from their Apple Watch at whatever interval you want.

So let's just say, you know, I don't know how, how you're giving your patients their, their ketamine, it doesn't really matter. 

**Dr. Jason Allen:** Sure. 

**Trevor:** But, so, oh, I should clear that out. I think it'll let me still go. One question I had was, if there is a contraindication, do we want to, we're I'm not trying to tell people how to run their practice, I'm just trying to give them all of the information.

Bring it to them, right? Mm-hmm. So if people want to go and give the treatment anyway to give mushrooms to somebody who's doing lithium or ketamine, you know, should we just let 'em go? Yep. So, but it's, at least we could say we warned 'em and, and not, okay. So I just, I just went into the dosing session and what I have here are your vitals.

We do a couple, I did some presets for you, and then that just populates all of heart rate. Again, we can lay these out however you like. Blood pressure. We've got respiratory, we've got body temperature, we have the diaphoresis which I believe you asked about. And then we have the the A VPU.

What do, I don't even know, I can't even remember what that stands for. But just to show you that we could track all this. Now, the cool thing about this score screen is this is gonna timestamp it when I hit save or when I hit, add another reading. And you can enter these as many times as you want. And, but this is the this is the first one.

So I'm gonna hit save and continue. And that's sort of like your baseline initial, and you'll, it was redundant from the previous one, so we may or may not want that in that previous screen. But now let's say, okay, we, we've got 'em in the office. They're, they're in the, the room and you're gonna dose 'em and you can start.

Now the timer's running and now everything from here forth until we stop the timer is. Being time tracked, and you'll have live readings, so you'll be able to go in and let's say, you know, at whatever time went, you want to go in and, and do an update. And you want to talk about what is their state, what is their level of responsiveness, what's their physical comfort?

Anything that you want to hear, you want their vitals again, put 'em in. And, or yeah, probably don't want 'em at 50, but this is an example of that where we're going to, right now it's just open notes, but it, it can't be any identifiable information, so we're probably gonna use that predictive text.

Yeah. 

**Dr. Jason Allen:** If, if I have three, let's say three people going in three different rooms, can I be using the same app? Closing out, opening up, closing, opening with three concurrent sessions. 

**Trevor:** Great question. We'll make it so you can, 

**Dr. Jason Allen:** okay. Ideal world, we got an iPad outside or in each room. Mm. 

**Trevor:** You're gonna like this.

When I, I hope you're gonna like it. Do, do you give the patient the iPad at all or do you just like, what is, are you verbally checking in with the patient? 

**Dr. Jason Allen:** For, for subjective data, we're verbally checking in For objective data, we're using machinery. They're handhelds or automated checking. 

**Trevor:** Shoot.

Wrote eight 40 minutes. We got seven minutes, but I, we can we'll pick up if you, you'll notice on your calendar. Okay. Real quick though. Same thing. So I saved that update. It's timestamped and you'll see all of these will just start stacking up down here. We can do the same thing. And, and as we're scrolling, the timer will stay at the top of the screen there.

We can do the same thing with an intervention that's like, Hey, we went in to do some verbal reassurance or guided breathing or physical touch. And, you know, let's just say we did some physical touch and we'll timestamp it, or we can do a beginning and end to see how long that went and we'll save it.

And then let's say there was an adverse event. We went and checked their vitals there. They were distressed, they needed this intervention. Again, an optional, optional note. Log that entry, save timestamped. So one of the things that I thought about was if you had to verbally check in with them, and this is, this is just sort of a little creative idea, but.

If you wanted to do we, I created a separate patient page, so if you wanted to give the patient the iPad where they didn't have to be bothered, we could do something like this. 

**Dr. Jason Allen:** Nice. 

**Trevor:** Where they can just, at any given time, just tap how they're feeling and it's timestamped and maybe kind of just get, give 'em a, a nonverbal way to, to check in.

**Dr. Jason Allen:** I like that Trevor. 

**Trevor:** So, so kind of make the tracking part of the environment without that just gives you options. Again, all of that will just continue to track and then let's say session's over. You hit end session. It says, all right, we've recorded that and now we're gonna get into the follow up.

And again, you'll get to create these however you like. But and I'll like, here, I'll just hit the number. 2, 2, 2, 2 and two, and it'll, it just advances. So it's, this form is clicked out normally. That should advance the screen too. That was, this is the ego dissolution check. You can, and, and this is just to sort of demonstrate any sort of assessment you want to do after this, the treatment we could set up that, you'll notice that was only three touches.

Here. This is the challenge, you know, again, 1, 2, 3, 4 clicks, and then you get a summary. And, and then we will close that out. And if there are any safety events, you know, we can do that. And then close the session. And so now you're done that your dosing session is done and you, let's say this was, you know, week three, week six, however many sessions you have done with that patient.

We will show whatever statistics you wanna see here. In this case I did PHQ nine score, but we can compare it to baseline, we can compare it to your, at your patient's average. We got a lot of flexibility here now that this is all built. Same thing here. What are the, you know, what is the tracking of their symptoms and.

Now the whole point of this is for, for you to be able to defend or you, any practitioner to be able to defend, whether it's in a malpractice suit or an insurance billing or with the authorities, Hey, I'm practicing real medicine. I'm not being reckless. 

**Dr. Jason Allen:** Perfect. 

**Trevor:** And all of this can be exported to CSV and if people, you know, the, the practitioners can, if, if they wanna see the data, all it is is a bunch of random numbers.

**Dr. Jason Allen:** Yeah. Right. Not identified. 

**Trevor:** Yep. And down here, you know, we've got a summary report that we, if you wanna print out a polished, kind of like that screen I showed you the, my protocols. Oh, I think we're gonna get cut off, but do you wanna just jump out and jump back in? 

**Dr. Jason Allen:** Yep. 

**Trevor:** Okay. 

**Dr. Jason Allen:** Use the other link.

**Trevor:** Yeah. 

**Dr. Jason Allen:** Okay.

**Trevor:** Okay. Can you hear me? 

**Dr. Jason Allen:** I can, can you hear Richard? Kurt? 

**Trevor:** I, I can hear you great. So that, that's, that's the, in a nutshell questions can, and I can show you more, but that's, those are the two kind of things that I thought would be exciting for you. 

**Dr. Jason Allen:** Oh, it's more than two things and it's already exciting.

I, you know, like I'm kind of tactile as well, like to mess around with it. I'm thinking about on the overview, I get, I get the research component, I get the clinical in, in practice patient component. As the overall tool of the PPN. How does an outsider take a look at this? With any, with any use at all?

Like if I, I'm naive to the, to psychedelic treatment. This is being proposed to me as a tool to utilize. Is there a way for me to, to to look at 

**Trevor:** Yeah, yeah. 

**Dr. Jason Allen:** Collected data? 

**Trevor:** Yes. You are 

**Dr. Jason Allen:** aggregated data. 

**Trevor:** You are the first person to see this other than Jason. And I built this with you in mind. So let me, lemme walk you through a couple things, but yes, this is, you're gonna get an invite whenever you wanna start poking around on it.

Just with the understanding that it, I'm still, it's still in the, it's a functioning re, you know, reporting tool. It is not finished. So couple things I'll show you over here are everything is logged. And tracked changes, safety checks. So this is a full compliance audit. You can track every single thing that has been done for your patient or your clinic or your network.

And then of course, if you're just the practitioner wanting to look at your patients, this is the, my protocols is your patients. Starting at the top is sort of like a dashboard, which if you wanted to kind of have everything in one place, you could start a new session like we just did. You can view your analytics, which I'll show you in a second, and you can log a follow up session with a patient who you already did a new session with.

Couple statistics. This is, Hey, I did 23 treatments last month. Again, you'll be able to deep dive into all this stuff. This is the sort of. You know, and these are the kind of things I thought you might like.

**Dr. Jason Allen:** Yeah. Yes. If you look it's good. 

**Trevor:** Oops. And then, and then down here, the bottom is some quick actions, you know, run some reports, whatever we wanna look, you know, put in here and then we can put some I left room for more visualizations.

This is one of your, the clinical intelligence or the analytics page. This is, this is where you'd be able to look at your practice on any sort of like clinical level, like how's our overall performance? How do our average treatments compare to the, the, the aggregate? Lots of options here.

Safety patient stuff. I mean, we can, we can do a lot trends. I, I had to stop putting features in. 

**Dr. Jason Allen:** Yeah. Great. 

**Trevor:** Because I wanted to talk to you first. Okay. Okay, so we covered these top four. Okay.

You don't happen to have a Gmail account, do you? 

**Dr. Jason Allen:** I do have a Gmail account. 

**Trevor:** Okay, cool. 'cause if we could use Google Meet from now on that we would never run into this problem. And I can, you know, it's just Zoom is just not user friendly and I, I've been using Google Meet for a long time, so anyway.

Back to what we were doing the fifth item down on the menu, and we can rearrange these as an interaction checker. So again, it's same kind of but this is a manual version of what we have before. So let's say that you are devising a treatment for a patient and you want to go and look up how does it interact?

You know, give me a, gimme, an interaction that you are familiar with. A negative one. 

**Dr. Jason Allen:** Hold on. So, so lithium and, and the five HT two as are a common one.

**Trevor:** This is still like, 

**Dr. Jason Allen:** okay, so I beca dummy DI began buprenorphine, 

**Trevor:** Ke I began in 

**Dr. Jason Allen:** Buprenorphine or Suboxone. 

**Trevor:** The C or. So this is great input 'cause whatever we're missing.

I want to add and make sure we got it. I don't know how to spell either. Was it started with a C or an S? 

**Dr. Jason Allen:** Suboxone. S-S-U-B-O-X-O-N-E. 

**Trevor:** Okay. It's not in here. But we can, I can add it. If I can find it, I can add it. 

**Dr. Jason Allen:** Okay. 

**Trevor:** And 

**Dr. Jason Allen:** you can write benzos just as a group. 

**Trevor:** Okay. Good to know. Because I had I had these categorized by by category and then I ended up taking that out because I, I thought it, anybody can look up something alphabetically, but not everyone knows the categories.

**Dr. Jason Allen:** Good point. Yeah. 

**Trevor:** But I could do both too. So let's put in MDMA and like Wellbutrin. 

**Dr. Jason Allen:** Okay. 

**Trevor:** Okay. Oh, this hasn't been updated. My, I had this updated, but it was pretty accurate. But I'm just now I'm starting to migrate over to the live database, out of the test database. So again, this is more, I, I'm, my goal is if I can't cite a reputable source and represent it here, we won't represent it.

But this, there will be nothing fabricated, nothing made up, nothing assumed. This is, everything in here should be backed by research. That's the goal. So then we've got a couple other things that, you know, if we want to do, like you said give the patient their ability to fill out maybe like their MEQ 30 form or something in advance, we can do that.

I, there's a ton of features in here I could show you 

**Dr. Jason Allen:** there Sure are. Boy, you've got some experience with this. That was really fast to put this together. No doubt. 

**Trevor:** Thank you. 

**Dr. Jason Allen:** Beck on the on the clinical day, I, I we went by so quickly. Was there, is there a place to do booster timing? 

**Trevor:** What do elaborate?

**Dr. Jason Allen:** An hour into session. You wanna do a booster? 

**Trevor:** Oh yeah. A new dosage. 

**Dr. Jason Allen:** Yeah. Two hours in boost. Yeah. So that's gonna be a pretty common theme. 

**Trevor:** Yeah.

**Dr. Jason Allen:** Okay. 

**Trevor:** So we'll go back in, we'll pick 

**Dr. Jason Allen:** your, this is gonna be valuable information. Who, for people who are new to be able to draw from this decision making with regard to booster timing.

**Trevor:** Yes. So I'm gonna just throw some data in here and and we will, we'll see how it goes. Okay. So we got our vitals. Put it in. Start the session. Okay. 

**Dr. Jason Allen:** I You're not, I'm not seeing, seeing your screen. 

**Trevor:** Oh, I'm sorry. It's 'cause we got cut off. 

**Dr. Jason Allen:** Yeah, I guess I logged back into the same one. We had a few minutes left on there.

There you go. Okay. 

**Trevor:** Okay. So timer's running and, yes. Same thing. You want to go in and, where did I put the boost? Maybe it's still in here. Yeah. Timer's still run. Oh, wrong screen.

I need to, I'm hidden by this toolbar here. Gimme my

go back. Dosing. Yeah. Here we go. So, yeah. You should be able to go in and dose as many times as you want and it'll timestamp it. 

**Dr. Jason Allen:** Okay. 

**Trevor:** So it'll just keep adding to the log everything that you do. And, and what I was was gonna ask you about was, you know, it, it, how, how would you like to see things laid out?

What are you going to use during session? Like that's, you just brought up a great one. Like, do we want all four of these things down here? Like including the dosage? Do you want, you know, like, I don't know from a boots on the ground standpoint how every, you know, and I, I assume that everybody's different.

And so I'm trying to make it just super simple and, and something as complex as a longitudinal care. Is hard to make. Simple. 

**Dr. Jason Allen:** Yeah. Yeah. This, and this is probably the hardest part, this is the biggest caveat with this work, for the most part, unless it's a macro dose, say psilocybin, that's pretty straightforward.

But in these clinical, we even call it the trifecta because we're gonna use three, likely three, two to four agents. And so there's this caveat longitudinally about a decision making protocol, which could certainly be refined over some point. Like at, if you did, you know, to quote Trevor, MVMA changed my life.

I can't imagine it was one, one dose, one time. It may have been several boosters at one time, or maybe spaced out over a month, several years. 

**Trevor:** It was, yeah, it was years. Years of therapy and intention.

**Dr. Jason Allen:** Intention. 

**Trevor:** Yeah. And, and that, that was the goal here, was to give you the flexibility. And, and I know why nobody's done this.

Be because you have to understand. Databases and analytics to do this. I don't design websites, the website, I'm just learning as I go. This is, this is an analytics engine that I built for you. And and you've got, you've got point in time. You've got a session you said could go eight hours or longer, and then you've got care that lasts for weeks, months, or years.

**Dr. Jason Allen:** Right. 

**Trevor:** And the goal was to give you the opportunity to track and analyze all of it.

So, anything that you'd like to see? I would say ask, ask for the moon. Okay. And I'll bet you, I I, I would take it as a personal challenge. See if I can get it in here and get it accurate and, and we'll test it out. You, you're, I've, I've got you. I've got an a naturopath I've known for a long time.

I'm friends with who, she doesn't work in psychedelics, but she's a doctor. I've got I'd like to get your intake input on who else we would potentially get as kind of pilot testers and invite you to, to help craft this, you know, let's, I want you to help co-create it. 

**Dr. Jason Allen:** Well, so I'm going to, I meet with a group of integration practitioners on Thursday evening, and I would, at this stage, I would, I would love to pilot, test this on Friday.

We'll have a full, we'll have at least two people. On a, in a session, so I could, I could highlight this as soon as Friday. 

**Trevor:** Okay. Sounds great. I'm, I'll have it ready for you and I have to get you an answer on how we will do, are you gonna have, I th you know, I think, I don't think there's any, any reason why you can't go back and forth between patients.

You know, 'cause what you would just do, and I just have to make sure that we've got the logic in here that keeps that timer running. 

**Dr. Jason Allen:** Okay. 

**Trevor:** And maybe we set a, how long would you say is the longest session you would ever do, like single dosing session? Well, 

**Dr. Jason Allen:** quite, quite honestly 30 hours would be an igan session.

**Trevor:** Okay. So what we could do is, is let's say you forget to turn it off. We could just set a, like a 72 hour auto off kind of thing. 

**Dr. Jason Allen:** Okay. 

**Trevor:** And if there's no data, there's no data. It's not a big deal. But I think that it's. I'll say yes, we'll make it happen. Where you can go back in and we will leave this running and then you can go back and find a different patient.

Right here. Oh, 

**Dr. Jason Allen:** if, if you wanna actually put a, a data point in right now that knowing that we'll do it at some point that we're gonna monitor with igan, it will be yes, we'll have vitals, blood pressure or heart rate respiratory rate. But the QT interval is the biggest thing. We're gonna be looking at 

**Trevor:** the QT interval.

**Dr. Jason Allen:** Uhhuh, it's a, it's an EKG reading. 

**Trevor:** Oh, okay. 

**Dr. Jason Allen:** It's not the full EKG, I mean we do that, but the interval is, is the time between beats essentially, and it can be prolonged. And that is the one cardiac arrhythmia potential with I begin 

**Trevor:** and you have an iPad. 

**Dr. Jason Allen:** We have an iPad. We definitely are running on laptops and paper.

And I do, I do have an iPad I can use. Yeah. 

**Trevor:** Okay. And you, you have multiple practitioners going? 

**Dr. Jason Allen:** We have, we will have multiple practitioners, multiple clients. 

**Trevor:** Perfect. I just wanna make sure that you don't abandon your current. I, I'd like to ask that you run parallel. 

**Dr. Jason Allen:** Oh, yeah. We're going to do paper form.

**Trevor:** Okay, good. Good. 

**Dr. Jason Allen:** And we'll do this alongside of it. Absolutely. 

**Trevor:** Yeah. Yeah. I'll have it ready for you. So what what's missing? What do you like, what would you change? 

**Dr. Jason Allen:** It's hard to know. Right now it's still two dimensional. I'm, I'm tactile, visceral. Oh. I can get into 

**Trevor:** Okay. 

**Dr. Jason Allen:** It'll be easier. Yeah. 

**Trevor:** All right.

**Dr. Jason Allen:** And especially having that in parallel with the paper right next to it, it'll be very clear what, you know, what I'm scribbling down is the important stuff. 

**Trevor:** Got it. What, i, is there anything glaring that you thought, Hey, this is way out of sequence or like, any, any modifications you, you could suggest before Friday?

And that's one question and then well, I'll ask that one first. 

**Dr. Jason Allen:** So a question is if this, we want this to be streamlined and succinct, popping in here and out of, if a question comes up with regard to, I want to track down a little bit more detail on a substance, on a, on a compound interaction. And I can certainly pop out and go to chat. GBTI can go to a Medline database, but hyperlinking out of here for resources potentially.

If you drug action, if, 

**Trevor:** if you want, or you can go in here and you can just pop down. We can move this wherever you want, but we got your AI right here too. 

**Dr. Jason Allen:** That's what I mean. So maybe if that is a floating tab on any page, just to make like a search page or, or an icon from any page I met, I can boom chop in and ask a question.

**Trevor:** You, you actually brought up a great point and I'm glad you asked because it's going in the top bar. 

**Dr. Jason Allen:** Okay. Oh good. 

**Trevor:** Yeah, what it, I'll show you what it actually looks like. And I had, I just, I wasn't happy with it, so I have two versions of it. The, the very first feature I designed was, I have two of 'em, but one of was, oh gosh, it doesn't really matter.

But lemme see if this is it. Oh, it doesn't matter. Well, anyway, I will have it I'll have it ready for you. 

**Dr. Jason Allen:** Okay. 

**Trevor:** So, okay, 

**Dr. Jason Allen:** I got another quick one then, and I'll go specific with IBN 'cause it's the most difficult one. On the dosing section during a, during a session. 

**Trevor:** Mm-hmm. 

**Dr. Jason Allen:** I would like to take some of the thinking out like it, I get a 2:00 AM booster.

We're using, we'll call, let's call it I bga 'cause it's I BGA session, but we may, we may use two separate compounds, iga, chloride or iga, TPA, which is total plant alkaloids. And the percentage of IGA in the TPA is about 80%. So let's just say on the, starting with the substance, let's say starting dose is, let's just say 100 milligrams.

Well, I'm gonna have a running calculation of the person's of the running dose of milligrams per kilogram. So if my second dose is 550, I want to have it be able to automatically calculate that. The total dose at that point will be 650 milligrams. But also what is that? Is that 12.1 milligrams per kilogram?

Does that make sense? That running? I'd like to have that running calculation. 

**Trevor:** Sure. And, and what are you kilograms, are you talking about body weight? 

**Dr. Jason Allen:** Yeah. Milligrams of, of the substance used per kilogram of body weight. 

**Trevor:** And you want that in a ratio or a percentage or what? Like, like imagine the display.

What does the display look like? Pic describe it for me. 

**Dr. Jason Allen:** Okay. So the display is, I've got, I've got columns. Columns are gonna be time and the rows are gonna be, let's say I began 8:00 AM 100 milligrams is, that's one column that's dose. The second column will be weight and kilograms. And the third column will be milligrams per kilogram.

**Trevor:** Okay.

**Dr. Jason Allen:** And so I'll scroll down again on a row. It will be substance. I began dose two with a time, and then this, it'll be the same column that says it'll say 500 milligrams. And then that's next one. We'll do the calculation of how many milligrams per kilogram is that. 

**Trevor:** Okay. I think I see, I think I can see it in, go ahead, sorry.

**Dr. Jason Allen:** Just so it'll be a running calculation. So I'm 12 hours into dosing and I, and I'm, I'm very, I'm weighing the pharmacologic versus psychological input and they're at 16.5 milligrams per kilogram. I know I've got wiggle room to go up to say 22 with this person, so I know I've got room and I don't have to redo that calculation every time.

**Trevor:** Okay. Yeah, we can do that. No problem. And then what else would you like to see as in a heads up display like that? Is there any other information, like calculations that you're doing on the regular? I mean, you could obviously see like the, the vitals. That's, that's the easy part, but this is exactly the, that's a perfect example of what I, what I'm looking for from you.

What, how can we. How can we allow you to be more present with your patients and take some of that manual work off your, 

**Dr. Jason Allen:** okay, 

**Trevor:** off your 

plate. 

**Dr. Jason Allen:** Well, I will give you one more, then there's gonna be a breakdown of the QT interval. And this is gonna be a big component for the literature. Because if you read, so there are 33 recorded deaths on IBA game in the past 70 years.

Almost all of them are poly, polypharmacy, non evaluated, but they're all cardiac. And so not if anybody's using IGA and not running an EKG, they're doing it wrong period. But they're looking at QT intervals. And there are different methodologies. There's the Simpson methodology, there's the Pearson methodology, et cetera.

And they're also different machinery. So a column on qt and then we're, we run it with two different, two different systems. And so we're gonna run a correlation of those if that's not too much, 'cause it'll be great for our, it'll be great for the field to collect that data. So if you know that if you're gonna be doing this work, you have to buy life pack, right?

So that you can run EKGs. Well, what QT interval are they running? Maybe that's too much information, right? 

**Trevor:** No, no. Do you have any, I, I will research it, but do you have any suggestions on the source of the, that data? 

**Dr. Jason Allen:** I have a paper I can send you if that's cool with you. 

**Trevor:** Yeah, please 

**Dr. Jason Allen:** do you do I have your, I have your cell.

4 9 9 9\. 

**Trevor:** That's fine. Or I can send you my email address, whatever you like. 

**Dr. Jason Allen:** I am just texting you my email address.

**Trevor:** Okay. I have it. Yeah. 

**Dr. Jason Allen:** And then I set the Gmail up that I don't use very often, but I can use that one. Oh, 

**Trevor:** oh good. Just, yeah, Gmail would be great. Just for personal stuff and at meetings.

I don't like it when I'm in a good conversation and I get cut off by, you know, pay for all these different 

**Dr. Jason Allen:** systems. I like it when I'm having a bad conversation, I get cut off. 

**Trevor:** Yeah. Yeah, I may follow up with you for some source or reference material on that, but but I. I, I think I can get a head start based on what you've shared.

Anything else that you can think of? 

**Dr. Jason Allen:** No, I think I, you, you've covered more than I could've, could've thought. You could've put in one place. Frankly, having used a lot of databases, 

**Trevor:** that's wonderful to hear. I'm, I'm, I'm hopeful that this will make the industry better and allow everybody to, to just be more present and and knowledgeable with your patients.

It's good. 

**Dr. Jason Allen:** Yeah. Yeah. It's really, it's really a safety issue, and it's really nice to see this because I, I am a little bit of a Luddite in, in response to something Jason text earlier about working on someone's campaign today and not wanting to do politics. Like I'd rather do the patient care stuff than this, but this stuff is gonna make it safer for people to be able to do this work, which is gonna make the world a better place.

**Trevor:** Agreed. Agreed. 

**Dr. Jason Allen:** But thank you for, for doing. I'm looking at the top and I'm seeing Chrome. How about Firefox, Chrome, safari? Any, any issues there? 

**Trevor:** This is a website, so it's a mobile responsive website. I can show you what it looks like in tablet form, but it shouldn't. I I have not. That's a great question.

I have not I haven't played around with that at all. So let's see if it responds. Oh, there it is over there. The, but this is, this is what it looks like tablet wise. It's very similar to what you already saw. Just, you know, it's, it's, it's responsive the more that, that you play with it. It, it's designed to work on iPhone and or Android, but it, we'll, we will iron out some of the bugs I'm sure.

But as you can see, it responds and. And so you don't have to like download a separate app, you just go Oh, 

**Dr. Jason Allen:** perfect. Yeah. 

**Trevor:** And you know, but there will be some tweaking. Okay. So last question, unless you've got more time and wanna talk about anything else what time would you like to, to do your pilot and would you like me to do a quick walkthrough with your staff in advance?

**Dr. Jason Allen:** I don't think there will be time to do a walkthrough in advance. Okay. I think we'll do it simultaneously with paperwork. 

**Trevor:** Okay. 

**Dr. Jason Allen:** As soon as Friday. 

**Trevor:** Okay. Just go easy on me 'cause I'm sure there will be moments of frustration. 

**Dr. Jason Allen:** Yeah. Well it's already better than I could have imagined. 

**Trevor:** Okay. I'm excited.

I'm excited that you like it. And if you think of anything between now and Friday, oh, I'm sorry. What time did you say your session was? 

**Dr. Jason Allen:** Oh, it'll start at 9:00 AM. 

**Trevor:** Okay, so I need to have this to you by no later than I'll try and get it to you Thursday night, but if not, you'll get it early Friday morning, 

**Dr. Jason Allen:** As the initial login.

So I'll not look at it before we go on our beta test. 

**Trevor:** Oh, no, no. You know, you know what I'm gonna do? I'll set you up with a login right away and 

**Dr. Jason Allen:** Okay. I'd like a little more familiarity than showing it off. 

**Trevor:** Yes. And then what we'll do is I just need to get, I have it locked down so nobody can sign up, but I'll, I will put a login, I'll contact you with all the login information.

I just want to get it live so that it, you know, the best case scenario is it works well for you on Friday, and you can use that as your first. Track, you know, your, your first entry and that that'll be saved. So I, I'm in the process today of migrating to the live database and that is a very meticulous thoughtful process.

So I, I will have a login for you tomorrow. 

**Dr. Jason Allen:** Okay. 

**Trevor:** Does that work for you? 

**Dr. Jason Allen:** Great. It looks fantastic. Really looking forward to using it. 

**Trevor:** I'm glad, I'm glad to hear that. Okay. Well and if you think of anything, feel free to text me, call me or email anytime. I am. I work from home and I'm pretty much this is by far, it started out as like, oh, you know, I do consulting for finance and, and this is way more exciting and interesting.

So I've been kinda working on this since the beginning of the year. 

**Dr. Jason Allen:** Well, Trevor, I've, I have text you a link to a note Adobe article that summarizes a lot of the work that we're doing to get an idea where we're coming, particularly that QT part. In that section. 

**Trevor:** Okay, great. I'll take a look at it right now.

