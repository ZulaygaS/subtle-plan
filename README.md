# Warm Hue Tasks

Create a modern, elegant To-Do List / Task Management application using a RAG (Red–Amber/Orange–Green) priority/status system.

The overall aesthetic should be minimal, warm, sophisticated and calming, rather than a typical bright productivity dashboard.

Colour palette

Use the attached neutral colour palette image as the visual reference. Build the interface primarily around warm neutrals:

Warm Cream: #F2E8D8

Oat / Sand Beige: #E4D3B8

Greige: #B9B0A2

Taupe: #9A8976

Camel: #B99A76

Walnut / Earth Brown: #70513A

Soft White: #FAF8F3

Charcoal: #292722

Use these neutral colours for the page background, cards, navigation, typography and supporting elements.

RAG system

Incorporate RAG clearly but use muted, earthy versions of the colours so they harmonise with the neutral palette:

 🔴 RED — Urgent / At Risk: muted terracotta red, approximately #B85C4A

 🟠 ORANGE — Attention / Medium Priority: warm clay orange, approximately #C78352

 🟢 GREEN — On Track / Completed: muted olive green, approximately #71805B

Avoid neon red, bright orange or saturated green. The RAG colours should feel premium, understated and cohesive with the neutral palette.

Dashboard layout

Create a clean responsive dashboard with:

Top header

 Page title: “My Tasks”

 Current date

 Search tasks field

 “+ Add Task” button

 Optional profile/settings icon

RAG summary section
Display three elegant summary cards:

RED — Urgent: number of overdue/high-risk tasks

ORANGE — Attention: tasks requiring attention soon

GREEN — On Track: tasks progressing normally or completed

Each card should have a subtle tinted background rather than a solid bright colour.

Task list
Each task should display:

 Checkbox

 Task name

 Short description or notes

 Due date

 Category/project

 RAG status indicator

 Priority

 Optional assignee

Use a small RAG colour pill/dot as the primary status indicator.

Example tasks:

 “Submit quarterly report” — 🔴 Urgent

 “Prepare presentation slides” — 🟠 Attention

 “Review project timeline” — 🟢 On Track

Task interaction

Allow users to:

 Add a task

 Edit a task

 Delete/archive a task

 Mark a task complete

 Change RAG status

 Set a due date

 Add notes

 Filter by Red / Orange / Green

 Filter by Today / This Week / Upcoming / Completed

 Search tasks

Visual style

Use:

 Warm cream background

 Off-white task cards

 Soft rounded corners

 Very subtle shadows

 Thin borders in beige/taupe

 Elegant dark charcoal typography

 Generous whitespace

 Minimal icons

 Refined editorial/interior-design-inspired aesthetic

 Subtle texture or tonal variation where appropriate

The interface should feel like a beautiful premium planner combined with a modern productivity dashboard, not a corporate project-management system.

Important design rule

Neutral colours should dominate the interface. RAG colours should communicate information, not become the overall visual theme.

Use approximately 75–85% neutral tones and 15–25% RAG/status colours.

Make accessibility a priority: ensure text has sufficient contrast, and never rely on colour alone to communicate task status. Pair each RAG colour with a label such as URGENT, ATTENTION, or ON TRACK and/or an appropriate icon.

Create the design for desktop and mobile responsive layouts, maintaining the same visual language across both.

Optional: make the RAG system more sophisticated

I'd actually recommend defining RAG as risk/status rather than simply priority:

RAGMeaningExample🔴 RedUrgent / At RiskOverdue, blocked, deadline approaching🟠 OrangeNeeds AttentionDue soon, partially complete, needs follow-up🟢 GreenOn TrackProgressing normally or completed

That makes the system useful for both personal to-do lists and project/task management, without conflating importance with risk. Add a watermark with my name Zulayga Salie

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://subtle-plan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f8ffcbb-1b7a-43dd-a75d-e0388b501782).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
