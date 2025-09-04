"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

export default function MemeMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  // init fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#000000",
      preserveObjectStacking: true,
    });
    fabRef.current = c;
    c.setWidth(640);
    c.setHeight(640);
    return () => { c.dispose(); fabRef.current = null; };
  }, []);

  // helpers
  function addText(text: string, atTop: boolean) {
    const c = fabRef.current!;
    const txt = new fabric.Textbox(text || (atTop ? "TOP TEXT" : "BOTTOM TEXT"), {
      fill: "#ffffff",
      fontFamily: "Impact, Arial Black, sans-serif",
      fontWeight: "700",
      fontSize: 48,
      stroke: "#000000",
      strokeWidth: 2,
      textAlign: "center",
      width: c.getWidth()! - 40,
      left: 20,
      top: atTop ? 20 : c.getHeight()! - 80,
      editable: true,
    });
    c.add(txt);
    c.setActiveObject(txt);
    c.requestRenderAll();
  }

  function updateText() {
    const c = fabRef.current!;
    // remove existing top/bottom labels (we tag by data)
    c.getObjects("textbox").forEach(obj => {
      // nothing fancy; let users add multiples
    });
    // just add new ones
    if (topText) addText(topText, true);
    if (bottomText) addText(bottomText, false);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(String(reader.result), (img) => {
        const c = fabRef.current!;
        // scale to fit
        const max = Math.min(c.getWidth()!, c.getHeight()!);
        const scale = Math.min(max / img.width!, max / img.height!);
        img.set({ left: 0, top: 0, selectable: false, scaleX: scale, scaleY: scale });
        c.clear();
        c.add(img);
        c.sendToBack(img);
        c.requestRenderAll();
      }, { crossOrigin: "anonymous" });
    };
    reader.readAsDataURL(file);
  }

  function download() {
    const c = fabRef.current!;
    const data = c.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = data;
    a.download = "novatok-meme.png";
    a.click();
  }

  return (
    <div>
      <div className="rounded-2xl border border-zinc-800 p-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm">Upload image</label>
            <input type="file" accept="image/*" onChange={onUpload}
              className="mt-1 w-full text-sm" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={download} className="px-3 py-2 text-sm rounded-xl bg-white text-black">
              Download PNG
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Top text</label>
            <input value={topText} onChange={e=>setTopText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Bottom text</label>
            <input value={bottomText} onChange={e=>setBottomText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="mt-3">
          <button onClick={updateText} className="px-3 py-2 text-sm rounded-xl border border-zinc-800">
            Add / Update Text
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-800">
        <canvas ref={canvasRef} />
      </div>

      <p className="text-xs text-zinc-500 mt-3">
        Drag text boxes to reposition. Use the corners to resize/rotate. Impact-style meme text with white fill and black stroke is applied by default.
      </p>
    </div>
  );
}
