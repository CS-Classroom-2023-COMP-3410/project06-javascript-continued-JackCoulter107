**NOTE: The feature here was not actually the last piece of conversation with chat-gpt in the conversation.md file since I tried to add a few things after it got stuck a bit early.**

1. *The new feature you attempted to add*

The new feature I tried to add that "broke" chat-gpt was a upgrade within project 5 (the drawing canvas). I tried to make it so that the background to not erase the current drawings, after multiple attempts and trying to prompt it to work it out from different angles it never ended up working even with 3 or 4 tries

2. *Why it is a reasonable feature to expect in a frontend project*

Because changing the background color without losing your current progress on a artwork seems like a very reasonable thing to want from a drawing software.

3. *How it was supposed to work*

It was supposed to save or isolate the current progress of the drawing and change the background color without ruining the current progress done with the brush tool

4. *How ChatGPT failed to implement it*

**First attempt:**

🛠️ Fixes Applied
Preserve existing strokes by:
Capturing the current canvas image.
Drawing the new background underneath the existing work.
Redraw the drawing after changing the background.

**Second attempt:**

🔧 Fix:
Save only the drawn strokes, not the old background.
Re-draw the strokes over the new background color, rather than restoring the entire canvas as an image.


**Third attempt:**

🔧 Fix: Separate Background and Drawing Layers
How It Works
Two Layers:
Background layer (a color fill applied first).
Drawing layer (stores user strokes separately).
No Image Capture for Background:
Instead of capturing the entire canvas, we only store strokes in history.
The background is set independently and can change without affecting drawings.

**Fourth Attempt:**

✅ Solution:
Instead of redrawing the entire history on every background change, we should:

Store the drawing separately from the background.
Apply the background change only once (not per mouse movement).
Use an off-screen buffer (image) for the strokes and reapply them only when needed.