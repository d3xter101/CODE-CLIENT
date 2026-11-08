// --card, --border and --input are the same navy, so a default field has no visible edge on a Card.
// The dark: prefix is needed to beat the dark: styles of Input and Button (the site is always dark),
// and that prefix would also beat their focus and error borders, so those two are set again here.
export const fieldClassName =
  "h-10 dark:bg-background dark:border-foreground/50 dark:hover:border-foreground/75 dark:focus-visible:border-ring dark:aria-invalid:border-destructive disabled:opacity-70";
