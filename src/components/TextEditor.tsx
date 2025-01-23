import { useState } from 'react';

export default function TextEditor() {
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [color, setColor] = useState('#ffffff');

  return (
    <div>
      <label>
        Font Size:
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </label>
      <label>
        Font Family:
        <input
          type="text"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        />
      </label>
      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
    </div>
  );
}
