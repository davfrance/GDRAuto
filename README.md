# An automatic RPG game powered by nothing but your luck

Challenge your luck in this random RPG where all you decide is your class.
You'll read and see numerous fights, relations between parties, weapons and more.

Link: [https://auto-gdr-zb5udbt5nq-ey.a.run.app/](https://gdr-auto.vercel.app/)

# Project TODO List

## User and Team Cards

- [x] Improve/Redesign User and Team Cards UI
- [x] Highlight specific user names within event descriptions (similar to team highlighting)

## Weapon Logic

- [ ] Implement weapon comparison logic (stats/rarity) before assigning looted weapons
- [ ] Prioritize assigning looted weapons to members without any weapon, even if it's not optimal

## Fight Scene

- [ ] Overhaul/Fix the Fight Scene UI layout and styling
- [ ] Test and fix potential issues with multiple fights occurring in a single turn
- [ ] Improve fight pacing and AI turn logic (currently too fast/simple)
- [ ] Fights against mobs should lower HPs 

## UI Improvements

- [x] Refactor RelationsTab component UI to match the overall page style
- [x] Refactor NewGame page UI to match the overall style

## Team Management

- [ ] Implement deselection of team when clicking outside the team list area
- [ ] Add functionality in NewGame page to select/save the player's starting team
- [ ] Ensure only the designated player team is controllable during fights
