## Goal

The goal is to add a progress icon to the toolbar for displaying user learning progress and
hyperlink(s) to the next exercise(s).

The help page already has a "Your Learning Progress" which is very verbose.
The progress icon should display a summary of progress and link(s) to the next exercise(s) and fit the progress page content on a single mobile display page.

## Action

- Check if the current web browser local storage data is sufficient for this use case and store additional data as necessary.
  - Note the exercise documents are categorized (TSL, thematic, incremental and so on) with exercises in each category in the sequential order to be completed.
  - Users may complete exercises from different categories in parallel.
- Add a progress icon to the toolbar to open the progress page.
- Progress page should display a summary of the exercises completed and hyperlink to the next exercise or exercises if user has complete exercises in multiple categories.
- Ask and clarify any ambiguity before generating code.

## Final step

- test the progress icon click event opens the progress page.
- test the hyperlinks opens the next exercise(s)
