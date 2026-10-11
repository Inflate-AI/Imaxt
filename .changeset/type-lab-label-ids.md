---
"@inflate-ai/imaxt-core": patch
---

`TypeLab`'s sliders and sample-text input now have `id`/`for` associations between each control and its `<label>`, restoring what the original React island did with `useId()`. The server-rendered version had dropped this (axe-core flagged it as a critical "form elements must have labels" violation during the blog integration). The id is derived deterministically from the sample text, so `renderTypeLab` stays a pure function.
