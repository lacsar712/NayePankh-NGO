import { memo } from 'react';
import { Award } from 'lucide-react';

function BrandingAssets({
  sigImage,
  stampImage,
  onUploadSignature,
  onUploadStamp,
  onResetAssets,
}) {
  return (
    <div className="bg-slate-50 border border-slate-250/60 p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Award className="h-4.5 w-4.5 text-primary-500" />
          <span>Official Certificate Branding Assets</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload the digital signature of the Founder and the Foundation stamp
          to be embedded on all generated certificates.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Founder's Digital Signature
            </label>
            <p className="text-[10px] text-slate-400 mb-3">
              Upload a clean scanned signature. A white/transparent background
              works best.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={onUploadSignature}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer w-full"
            />
          </div>
          {sigImage ? (
            <div className="flex items-center justify-between mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <img
                src={sigImage}
                className="h-10 object-contain max-w-[150px] mix-blend-multiply"
                alt="Founder Signature"
              />
              <span className="text-[10px] text-emerald-600 font-bold">
                ✓ Signature Uploaded
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 italic mt-2">
              No custom signature uploaded. Falling back to handwriting style
              font.
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Foundation Stamp
            </label>
            <p className="text-[10px] text-slate-400 mb-3">
              Upload the official circular stamp image of the foundation.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={onUploadStamp}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer w-full"
            />
          </div>
          {stampImage ? (
            <div className="flex items-center justify-between mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <img
                src={stampImage}
                className="h-10 object-contain max-w-[100px] mix-blend-multiply"
                alt="Foundation Stamp"
              />
              <span className="text-[10px] text-emerald-600 font-bold">
                ✓ Stamp Uploaded
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 italic mt-2">
              No custom stamp uploaded. Falling back to signature labels.
            </div>
          )}
        </div>
      </div>

      {(sigImage || stampImage) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onResetAssets}
            className="text-xs font-bold text-red-500 hover:text-red-650 px-3 py-1.5 bg-red-50 hover:bg-red-100/50 rounded-lg border border-red-100 transition-colors cursor-pointer"
          >
            Reset to Default Assets
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(BrandingAssets);
