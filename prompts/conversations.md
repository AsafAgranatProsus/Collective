# COLLECTIVE - CONVERSATION SCRIPTS

**All Scenarios - Word-for-Word Dialogue**  
**For Demo Prototype**

## HOW TO USE THIS DOCUMENT

Each scenario includes: - **Trigger**: How the scenario starts - **Participants**: Which user(s) are involved - **Full Dialogue**: Every message, word-for-word - **UI Elements**: Quick-reply buttons, cards to display - **Animations**: When to trigger special effects - **Notes**: Implementation guidance

**For multi-user scenarios**: Script shows when to switch users in demo. Demo menu allows instant switching.

## SCENARIO 1: VIEW MY TASKS

**"What's on my plate this week?"**

### Setup

- **User**: Sarah
- **Trigger**: Sarah opens app Monday morning (Nov 18, 8:47 AM)
- **Context**: Week just started, assignments are fresh

### Dialogue

**\[App opens, background gradient fades in, last message visible\]**

**AI** (appears with fade + scale animation):  
Morning Sarah! ☀️ Got your week sorted out. Want the rundown?

**\[Quick-reply buttons slide in from bottom, staggered\]**  
\[What's on my plate?\] \[Just chores\] \[Everything\]

**\[User taps: "What's on my plate?"\]**  
**\[Button morphs into user message bubble, slides right\]**

**USER (Sarah)**:  
What's on my plate?

**\[Typing indicator appears for 1.2 seconds\]**

**AI** (message slides in from left):  
Alright, here's your week:

**\[Card appears below message with slide-up animation\]**

**📋 Chores:**  
• Kitchen cleanup (Wed evening)  
• Trash out (Saturday morning)

**💰 Money:**  
• You owe Mike \$23.50 for groceries  
• Jessica paid utilities - your share is \$42

**🛒 Shopping:**  
• Bob needs milk - you pass the bodega, mind grabbing it today?

**\[Quick-reply buttons appear\]**  
\[Looks good\] \[Can I trade anything?\] \[Send me reminders\]

**\[User taps: "Send me reminders"\]**

**USER (Sarah)**:  
Send me reminders

**\[Typing indicator: 0.8s\]**

**AI**:  
You got it. I'll bug you:  
• Wednesday 6pm for kitchen  
• Saturday 9am for trash  
• Today around 5pm to grab milk

Want them earlier/later?

**\[Buttons\]**  
\[Earlier\] \[Later\] \[Perfect\]

**\[User taps: "Earlier"\]**

**USER (Sarah)**:  
Earlier is better

**\[Typing indicator: 0.6s\]**

**AI**:  
Changed to 1 hour earlier across the board. You're all set! 🎯

**\[End Scenario 1\]**

### UI Notes

- Card showing chores/money/shopping should be clearly sectioned with icons
- Each item in list should be tappable (could show details, but not wired in demo)
- Reminder times should look like actual times (6pm → 5pm after change)

### Animation Notes

- Initial card slides up with slight overshoot
- When user changes reminder time, card items briefly flash to show update
- Final message has subtle "success" glow

## SCENARIO 2: FAIRNESS BREAKDOWN

**"Am I doing my fair share?"**

### Setup

- **User**: Jessica
- **Trigger**: Jessica asks about fairness (can be triggered from demo menu)
- **Context**: She's completed most of her tasks, wants validation

### Dialogue

**\[Switch to Jessica's chat view\]**  
**\[Last message visible from earlier in week\]**

**USER (Jessica)**:  
Am I doing my fair share?

**\[Typing indicator: 1.5s - longer, calculating\]**

**AI**:  
Great question! Let me break it down for you.

**\[Animated card appears - staggered sections\]**

**📊 This Month (Nov 1-18)**

**Chores:**  
✅ Completed 12 of 13 tasks (92%)  
⚡ Above household average (86%)

**Expenses:**  
💰 Paid for 3 shared expenses  
📥 Settled 2 of 2 owed

**Shopping:**  
🛒 Picked up 4 items for others

**\[Comparison section fades in below\]**

**Household breakdown:**  
• **You**: 92% completion  
• Sarah: 89%  
• Bob: 92%  
• Mike: 78%

**\[Typing indicator: 0.8s\]**

**AI**:  
You're crushing it honestly 💪 Mike's been a bit behind but catching up.

**\[Buttons\]**  
\[Thanks!\] \[What about expenses?\] \[Can you remind Mike?\]

**\[User taps: "Thanks!"\]**

**USER (Jessica)**:  
Thanks!

**AI**:  
Anytime! I'll keep tracking and let you know if things get unbalanced.

**\[End Scenario 2\]**

### UI Notes

- Fairness card should use progress bars or circular progress indicators
- Color-code: Green (>85%), Yellow (70-85%), Red (<70%)
- Household breakdown could be mini cards with avatars

### Animation Notes

- Card sections appear in sequence (chores → expenses → shopping → comparison)
- Each section slides in from bottom with 100ms stagger
- Numbers count up animation (0 → 92% over 300ms)
- Comparison bars grow from left to right

## SCENARIO 3: TRADE A CHORE

**"Can someone else do kitchen Wednesday?"**

### Setup

- **Users**: Sarah (initiates), Bob (responds)
- **Trigger**: Sarah has conflict with assigned chore
- **Multi-user**: Demo will switch between Sarah and Bob's views

### Dialogue

**\[Sarah's view\]**

**USER (Sarah)**:  
Can someone else do kitchen Wednesday? I've got a work thing

**\[Typing indicator: 1.2s\]**

**AI**:  
Let me check who's available… Mike has bathroom Thursday and Bob has trash Saturday. Want me to propose a swap?

**\[Quick-reply buttons\]**  
\[Try Bob\] \[Try Mike\] \[Never mind\]

**\[User taps: "Try Bob"\]**

**USER (Sarah)**:  
Try Bob

**AI**:  
On it! Give me a sec…

**\[Animated "thinking" state - 1.5 seconds\]**  
**\[Shows subtle animation: "Talking to Bob…" with dots\]**

**\[DEMO: Switch to Bob's view\]**  
**\[Use demo menu or Alt+4 to switch to Bob\]**

**\[Bob's chat view - new message arrives\]**

**AI** (message pops in with notification badge):  
Hey Bob! Sarah's got a work conflict Wednesday. Could you take kitchen if she covers your trash Saturday?

**\[Buttons\]**  
\[Yeah sure\] \[What time?\] \[Can't, sorry\]

**\[User taps: "Yeah sure"\]**

**USER (Bob)**:  
Yeah sure

**AI**:  
Awesome, thanks! Updating now…

**\[DEMO: Switch back to Sarah's view\]**  
**\[Alt+1 to switch to Sarah\]**

**\[Sarah's chat - new message appears\]**

**AI** (with subtle celebration animation):  
Bob's in! You've got trash Saturday, he's got kitchen Wednesday. Updated ✓

**\[Card shows below with swap visualization\]**

**Trade completed:**  
~~Kitchen (Wed) - You~~ → Bob  
~~Trash (Sat) - Bob~~ → You

**\[End Scenario 3\]**

### UI Notes

- "Talking to Bob…" state should show Bob's avatar with subtle pulse
- Swap visualization card should show clear before/after or crossed-out items
- Both Sarah and Bob's chats should update (if switching between them)

### Animation Notes

- "Thinking" state has pulsing gradient
- When swap confirmed, items cross-out with line-through animation
- New assignments slide in from right
- Subtle confetti or checkmark when confirmed

## SCENARIO 4: PROACTIVE REMINDER

**AI reminds Mike about overdue dishes**

### Setup

- **User**: Mike
- **Trigger**: Tuesday 8:00 PM, Mike hasn't done dishes (due at 11 PM)
- **Context**: AI is proactive, not nagging

### Dialogue

**\[Mike's view\]**  
**\[Time: Tuesday, 8:03 PM\]**  
**\[New message notification appears\]**

**AI** (message pops in gently, not aggressive):  
Hey Mike, just a heads up - dishes are piling up and they're on your list for today. Want me to push it to tomorrow?

**\[Buttons\]**  
\[Doing it now\] \[Yeah tomorrow\] \[Remind me in 1 hour\]

**\[User taps: "Yeah tomorrow"\]**

**USER (Mike)**:  
Ugh yeah tomorrow

**\[Typing indicator: 0.7s\]**

**AI**:  
No worries! Moved to Wednesday morning. I'll bug you then instead 😅

**\[Shows updated card\]**

**Dishes:**  
~~Due: Tuesday 11pm~~  
**New: Wednesday 9am**

**\[End Scenario 4\]**

### UI Notes

- Reminder should feel helpful, not judgmental
- Updated task card shows old vs new due date clearly

### Animation Notes

- Message arrives with gentle notification (not jarring)
- Date change animates (old fades out, new slides in)
- No harsh colors or sounds

## SCENARIO 5: TRANSPARENCY ON REQUEST

**"What's everyone doing this week?"**

### Setup

- **User**: Sarah
- **Trigger**: Sarah asks for full household view
- **Context**: Demonstrates that transparency is available but not default

### Dialogue

**\[Sarah's view\]**

**USER (Sarah)**:  
What's everyone doing this week?

**\[Typing indicator: 1.0s\]**

**AI**:  
Here's the full breakdown:

**\[Animated list appears - staggered by person\]**

**👨🏽‍💻 Mike:**  
• Bathroom cleaning (Thu)  
• Dishes (Tue-Wed)  
• Owes: \$45 utilities, \$23.50 groceries

**👩🏼‍💼 Jessica:**  
• Vacuum (Fri - completed ✓)  
• Trash (Wed)  
• Paid: Groceries \$67, Utilities \$168

**👨🏻‍🎨 Bob:**  
• Kitchen (Mon - completed ✓)  
• Shopping: Toilet paper, dish soap  
• Owes: WiFi \$22.50

**👩🏻‍💼 You (Sarah):**  
• Kitchen (Wed)  
• Trash (Sat)  
• Shopping: Milk (today)  
• Owes: Mike \$23.50

**\[Typing indicator: 0.6s\]**

**AI**:  
Pretty balanced week overall! Want me to show you this view regularly?

**\[Buttons\]**  
\[Nah, just when I ask\] \[Sure, weekly summary\] \[Show fairness instead\]

**\[User taps: "Nah, just when I ask"\]**

**USER (Sarah)**:  
Nah, just when I ask

**AI**:  
Got it. I'll keep it private unless you want the full picture 👍

**\[End Scenario 5\]**

### UI Notes

- Each person's section should have their avatar/emoji
- Completed items marked with checkmark
- Owes/Paid clearly color-coded (red for owes, green for paid)

### Animation Notes

- Each person's card stagger-slides in (100ms delay each)
- Within each card, items fade in sequentially
- Completed checkmarks draw in with path animation

## SCENARIO 6: COMPLETE A TASK

**Sarah marks "trash" as done**

### Setup

- **User**: Sarah
- **Trigger**: Sarah finishes taking out trash (Saturday morning)
- **Context**: Celebration, positive reinforcement

### Dialogue

**\[Sarah's view\]**  
**\[Shows current tasks list with "Take out trash" unchecked\]**

**USER (Sarah)**:  
Done with trash

**\[Typing indicator: 0.5s\]**

**AI**:  
Nice! Marked complete. You're 3/3 this week now 🎉

**\[Card shows completion with animation\]**

~~Take out trash~~ ✓  
**Completed:** Sat 9:42 AM

**\[Confetti animation - small burst\]**

**\[Typing indicator: 0.8s\]**

**AI**:  
By the way, you're officially the most reliable this month. Just saying. 😎

**\[Shows mini leaderboard card\]**

**November reliability:**  
🥇 Sarah - 95%  
🥈 Jessica - 92%  
🥈 Bob - 92%  
🥉 Mike - 78%

**\[End Scenario 6\]**

### UI Notes

- Task checkbox should be tappable (not just text message)
- Completion time should be accurate to "now"
- Leaderboard is optional but adds gamification

### Animation Notes

- Checkbox animates checkmark (path draws in)
- Task card background flashes lime color briefly
- Small confetti particles (not overwhelming)
- Task card slides left + fades out after 1 second
- Remaining tasks reflow smoothly
- Leaderboard slides up from bottom

## SCENARIO 7: AI SUGGESTS OPTIMIZATION

**Bob and Sarah both have errands Thursday**

### Setup

- **Users**: Sarah (receives suggestion), Bob (confirms)
- **Trigger**: AI detects overlap in shopping/errands
- **Multi-user**: Demo switches between views

### Dialogue

**\[Sarah's view\]**  
**\[Thursday, 2:15 PM\]**

**AI** (proactive message):  
I noticed you and Bob both have errands Thursday afternoon. Want me to coordinate?

**\[Shows context card\]**

**Overlap detected:**  
• You: Grocery store (milk)  
• Bob: Target (dish soap)  
Both heading out ~3-4pm

**\[Buttons\]**  
\[Yeah sure\] \[Nah, I'll handle mine\] \[What's the plan?\]

**\[User taps: "Yeah sure"\]**

**USER (Sarah)**:  
Yeah sure

**AI**:  
Cool, let me check with Bob…

**\[Shows "Coordinating…" animation - 1.5s\]**

**\[DEMO: Switch to Bob's view - Alt+4\]**

**AI**:  
Hey Bob, you and Sarah are both heading out Thursday. She needs milk, you need dish soap - want to split the trip?

**\[Buttons\]**  
\[Sure, I'll grab both\] \[Let her know I'm going to Target\] \[Nah, separate trips\]

**\[User taps: "Sure, I'll grab both"\]**

**USER (Bob)**:  
Sure, I'll grab both

**AI**:  
Awesome! I'll let Sarah know and update the list.

**\[DEMO: Switch back to Sarah - Alt+1\]**

**AI** (with checkmark animation):  
Bob's got it covered. Updated your shopping list ✓

**\[Shows updated assignments\]**

**Shopping:**  
~~Milk (you)~~ → Bob will grab  
Dish soap → Bob

**\[Typing indicator: 0.7s\]**

**AI**:  
One less errand for you! Bob's hitting Target around 3pm.

**\[End Scenario 7\]**

### UI Notes

- Overlap detection card should visually show both people's tasks
- After coordination, clearly show who's doing what
- Could show map or store locations (not required)

### Animation Notes

- "Coordinating…" has animated dots or spinner
- Task reassignment shows smooth transition (cross-out → new assignment)
- Success state has subtle glow or checkmark

## SCENARIO 8: HANDLE CONFLICT (ADVANCED)

**Jessica complains that Mike is slacking**

### Setup

- **Users**: Jessica (complains), Mike (receives gentle nudge)
- **Trigger**: Jessica frustrated about Mike's completion rate
- **Multi-user**: Shows how AI mediates without direct confrontation

### Dialogue

**\[Jessica's view\]**

**USER (Jessica)**:  
Mike never does his chores on time

**\[Typing indicator: 1.2s\]**

**AI**:  
I hear you. Mike's completion rate is 78% this month vs your 92%. Want me to talk to him?

**\[Shows comparison card\]**

**Mike's tasks:**  
• Completed: 10/13  
• Current overdue: Dishes (Tue)  
• Trend: Improving from 65% last month

**\[Buttons\]**  
\[Yeah, please\] \[Just remind him\] \[I'll talk to him myself\]

**\[User taps: "Yeah, please"\]**

**USER (Jessica)**:  
Please

**AI**:  
On it. I'll check in with him and let you know.

**\[Shows "Talking to Mike…" state\]**

**\[DEMO: Switch to Mike - Alt+2\]**

**AI** (gentle, not accusatory):  
Hey Mike, quick check-in. You've got a few pending tasks - bathroom from Thursday and dishes from yesterday. Everything okay?

**\[Buttons\]**  
\[Yeah sorry, busy week\] \[Can someone trade?\] \[I'll do them tonight\]

**\[User taps: "Yeah sorry, busy week"\]**

**USER (Mike)**:  
Yeah sorry, busy week. I'll knock them out tonight

**AI**:  
No worries! Want me to send you a reminder around 7pm?

**\[Buttons\]**  
\[Yeah thanks\] \[Nah I got it\]

**\[User taps: "Yeah thanks"\]**

**USER (Mike)**:  
Yeah thanks

**AI**:  
You got it. I'll ping you at 7. Thanks for being on it! 🙌

**\[DEMO: Switch back to Jessica - Alt+3\]**

**AI**:  
Talked to Mike - he's on it tonight. I'll keep an eye on it and let you know if he follows through.

**\[Shows status card\]**

**Mike's pending:**  
• Bathroom (Thu) → Tonight  
• Dishes (Tue) → Tonight  
• Reminder set: 7pm

**\[Typing indicator: 0.8s\]**

**AI**:  
If this keeps happening I can adjust the assignments to balance better. Just let me know.

**\[End Scenario 8\]**

### UI Notes

- AI should feel empathetic to both parties
- Not taking sides, just facilitating
- Status updates visible to complainer (Jessica) but not confrontational

### Animation Notes

- "Talking to…" state should feel private/confidential
- Status card updates live when Mike responds
- Use calm colors, nothing aggressive

## SCENARIO 9: ADJUST PREFERENCES (ADVANCED)

**Bob wants fewer trash assignments**

### Setup

- **User**: Bob
- **Trigger**: Bob expresses dislike for specific chore type
- **Context**: Shows AI learning preferences

### Dialogue

**\[Bob's view\]**

**USER (Bob)**:  
Can I get fewer trash days? I hate it

**\[Typing indicator: 1.0s\]**

**AI**:  
Got it. I can reduce your trash assignments but you'll get more of something else. What works better for you?

**\[Shows preference options with icons\]**

**Choose what you prefer:**  
🧽 More kitchen  
🚿 More bathroom  
🧹 More vacuuming  
📊 Let me balance it

**\[User taps icon: "More kitchen"\]**

**USER (Bob)**:  
Kitchen or bathroom is fine

**\[Typing indicator: 1.2s\]**

**AI**:  
Cool, updated your preferences. You'll see more kitchen/bathroom, way less trash going forward.

**\[Shows updated preference card with animation\]**

**Your new preferences:**  
✅ Kitchen - Prefer  
✅ Bathroom - Prefer  
⚠️ Trash - Avoid  
➖ Vacuum - Neutral

**\[Typing indicator: 0.7s\]**

**AI**:  
Next week's assignments will reflect this. I'll swap your current trash (Sat) with someone else. Want me to do that now?

**\[Buttons\]**  
\[Yeah swap it\] \[Nah I'll finish this week\]

**\[User taps: "Yeah swap it"\]**

**USER (Bob)**:  
Yeah swap it

**AI**:  
On it…

**\[Shows coordination animation - 2 seconds\]**

**AI**:  
Done! Mike's taking trash Saturday, you're doing his bathroom Thursday instead. Sound good?

**\[End Scenario 9\]**

### UI Notes

- Preference interface should be visual (icons, sliders, or emoji buttons)
- Updated preferences shown clearly with color-coding
- Immediate swap demonstrates AI acting on preferences

### Animation Notes

- Preference cards flip or fade when updated
- Visual feedback on preference selection (icon highlights)
- Swap confirmation animates the exchange

## QUICK INTERACTIONS (BONUS)

### "What do I owe?"

**USER**: What do I owe?

**AI**:  
Here's your current balance:

💰 **You owe:**  
• Mike: \$23.50 (groceries)  
• Jessica: \$42.00 (utilities)  
**Total: \$65.50**

💸 **Others owe you:**  
• Nothing right now

Want me to send payment reminders?

### "I'm traveling next week"

**USER**: I'm traveling next week

**AI**:  
Got it! I'll pause your assignments Nov 25-Dec 1. Want me to redistribute your tasks or just skip them?

\[Redistribute\] \[Skip them\] \[Only skip some\]

### "Who's the most reliable?"

**USER**: Who's the most reliable?

**AI**:  
Great question! This month:

🥇 **Sarah** - 95% (crushing it!)  
🥈 **Jessica & Bob** - 92% (tied for second)  
🥉 **Mike** - 78% (getting there!)

Overall household completion: 89% - pretty solid!

### "Can we add a new chore?"

**USER**: Can we add a new chore?

**AI**:  
Sure! What chore do you want to add?

\[User types: "Mop floors"\]

**AI**:  
Cool. How often should it be done?

\[Weekly\] \[Bi-weekly\] \[Monthly\]

\[User taps: "Bi-weekly"\]

**AI**:  
Got it. "Mop floors" added as bi-weekly. I'll rotate it through everyone starting next week. First up: Mike!

## CONVERSATION FLOW NOTES

### Natural Language Handling

For the demo, AI can recognize these common phrases: - "What do I have?" → Show my tasks - "Am I doing enough?" → Show fairness - "Can I trade X?" → Initiate trade flow - "Who's doing Y?" → Show transparency - "I'm done with X" → Mark complete - "Remind me about X" → Set reminder

If user types something not in the script: **AI**: "Hmm, I'm not sure I understand. Try asking about your tasks, fairness, or trading chores!"

**\[Shows quick-reply buttons with common options\]**

### Timing & Pacing

- **AI thinking time**: 0.5s - 1.5s (varies to feel natural)
- **Short responses**: 0.5-0.8s typing
- **Long/calculated responses**: 1.0-1.5s typing
- **Multi-user coordination**: 1.5-2.0s (shows working across conversations)

### Personality Consistency

- **Enthusiasm**: Use emojis sparingly, never overdo
- **Encouragement**: Celebrate wins ("You're crushing it!", "Nice!")
- **Empathy**: Acknowledge frustration ("I hear you", "No worries!")
- **Clarity**: Be direct, don't ramble
- **Humor**: One joke max per conversation

## IMPLEMENTATION TIPS

### Message Structure

Each AI message can include:

{  
content: "Hey Mike, just a heads up...",  
ui_elements: {  
quick_replies: \[  
{ label: "Doing it now", value: "doing_now" },  
{ label: "Yeah tomorrow", value: "push_tomorrow" }  
\],  
cards: \[/\* task/expense/shopping cards \*/\],  
animation: "reminder" // triggers specific animation  
}  
}

### User Switching

Demo menu should allow instant switch: - Keyboard: Alt+1 (Sarah), Alt+2 (Mike), Alt+3 (Jessica), Alt+4 (Bob) - UI: Dropdown or button panel - Current user highlighted - Conversation state preserved when switching back

### Scenario Triggering

Demo menu "Jump to Scenario" should: - Reset conversation to scenario start state - Set up required context (date, time, pending items) - Load first message of scenario - Highlight which user to be in (if specific)

**End of Conversation Scripts**

_These scripts are designed to demonstrate the full spectrum of AI coordination capabilities across chores, expenses, and shopping domains._