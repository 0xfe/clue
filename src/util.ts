function onEnterPressed(sel: string, cb: (Event) => void): void {
  $(sel).keyup((event) => {
    if ((<KeyboardEvent>event).key === 'Enter') {
      cb(event);
    }
  });
}

export { onEnterPressed };
