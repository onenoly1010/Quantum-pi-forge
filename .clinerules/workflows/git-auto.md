# Git Automation Protocol
This workflow automates feature branching and commit cycles.

## Step 1: Branch Creation
Check the current branch. If on 'main', create a new branch named `feat/task-[ID]`.

## Step 2: Change Analysis
Run `git status --porcelain`. If changes exist, analyze the diff of all files.

## Step 3: Semantic Commits
Generate a commit message following the OINIO standard:
`feat(scope): detailed description of logic inversion`
`chore(logs): update activity.log`

## Step 4: Push and Sync
Push the branch to origin and provide the URL for review.