"use client";
import { useRouter } from "next/navigation";
import Tick from "@/icons/Tick";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState} from "@/lib/Store/store";

import RichTextEditor from "@/common/TextEditor";
const BlogDetail = () => {
  const [editorContent, setEditorContent] = useState('');
    const router = useRouter();
  const loading = useSelector((state: RootState) => state.yachts.addLoading);

  return (
    <div className="mt-4 h-[calc(100vh-128px)] flex justify-between flex-col">
      <div>
        
      <p className="font-bold text-[#222222] ms-2 mb-3">Blog Content</p>
      <div className="w-full">
        <RichTextEditor
          value={editorContent}
          onChange={(html) => setEditorContent(html)}
        />
      </div>
</div>
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={() => router.push("/blog")} className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium">
          <MdKeyboardArrowLeft />
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`rounded-full px-[16px] py-[8px] bg-[#001B48] hover:bg-[#222222] text-white flex items-center justify-center gap-2 font-medium ${loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
        >
          {loading ? "Save ..." : <><Tick /> Save</>}
        </button>
      </div>


    </div>
  )
}
export default BlogDetail