"use client";

import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

interface EditorWysiwygProps {
  valueFormik: string;
  onChangeFormik: (value: string) => void;
}

export default function EditorWysiwyg({
  valueFormik,
  onChangeFormik,
}: EditorWysiwygProps) {
  function onChange(e: any) {
    onChangeFormik(e.target.value);
  }

  return (
    <>
      <EditorProvider>
        <Editor
          containerProps={{ style: { resize: "vertical" } }}
          value={valueFormik}
          onChange={onChange}
        >
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
            <HtmlButton />
            <Separator />
            <BtnStyles />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </>
  );
}
