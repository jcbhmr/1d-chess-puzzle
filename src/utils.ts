/**
 * ℹ This is a rather niave implementation that doesn't handle
 * `.stopPropagation()` or the two event phases. It's very basic. That's OK for
 * now but this class could definitely be improved.
 */
export abstract class EventTargetWithBubbling extends EventTarget {
    dispatchEvent(event: Event): boolean {
      return (
        super.dispatchEvent(event) || (this.parentNode?.dispatchEvent(event) ?? false)
      );
    }
  
    abstract readonly parentNode?: EventTarget | EventTargetWithBubbling | null;
  }