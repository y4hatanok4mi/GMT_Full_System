import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useMemo, useRef, forwardRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}

const ForwardedReactQuill = forwardRef((props: any, ref: any) => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
  return <ReactQuill {...props} ref={ref} />;
});

const RichEditor = ({ placeholder, onChange, value }: RichEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    const quillEditor = quillRef.current?.getEditor();

    if (quillEditor) {
      const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            console.log("DOM updated!");
          }
        }
      });

      const config = { childList: true, subtree: true };
      observer.observe(quillEditor.root, config);

      return () => observer.disconnect();
    }
  }, []);

  return (
    <ForwardedReactQuill
      ref={quillRef}
      theme="snow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

ForwardedReactQuill.displayName = 'ForwardedReactQuill';

export default RichEditor;
