import os
import glob

auth_dir = "src/app/(store)/(auth)"
pages = glob.glob(f"{auth_dir}/**/page.tsx", recursive=True)

for filepath in pages:
    with open(filepath, 'r') as f:
        content = f.read()

    # Headings and Typography
    content = content.replace(
        'text-xs font-semibold tracking-[0.2em] text-[#BC8477] uppercase mb-4',
        'text-sm font-bold text-[#BC8477] mb-4'
    )
    content = content.replace(
        'font-bold text-4xl text-[#3A3331] font-light',
        'font-bold text-4xl text-gray-900 tracking-tight'
    )
    content = content.replace(
        'text-sm text-[#7A7371] font-light',
        'text-sm text-gray-500 font-medium'
    )
    content = content.replace(
        'bg-[#E8E1DE]',
        'bg-gray-100'
    )
    content = content.replace(
        'text-[10px] font-bold tracking-[0.1em] text-[#7A7371] uppercase',
        'text-xs font-bold text-gray-500 uppercase tracking-widest'
    )
    
    # Inputs
    content = content.replace(
        'w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] transition-colors focus:outline-none focus:border-[#BC8477] placeholder:text-[#B5AFAD]',
        'w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400'
    )
    # the password input has a `pr-10` at the end
    content = content.replace(
        'w-full h-10 bg-transparent border-b border-[#E8E1DE] text-sm text-[#3A3331] transition-colors focus:outline-none focus:border-[#BC8477] placeholder:text-[#B5AFAD] pr-10',
        'w-full h-12 bg-gray-50 rounded-xl px-4 text-sm text-gray-900 border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#BC8477]/20 focus:border-[#BC8477] placeholder:text-gray-400 pr-10'
    )

    # Buttons
    content = content.replace(
        'w-full h-12 bg-[#3A3331] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BC8477] transition-all flex items-center justify-center gap-2 group',
        'w-full h-12 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-md flex items-center justify-center gap-2 group'
    )
    content = content.replace(
        'w-full h-12 border border-[#E8E1DE] text-[#3A3331] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#F5F2F0] transition-colors flex items-center justify-center gap-3',
        'w-full h-12 border border-gray-200 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-3'
    )
    
    # Links
    content = content.replace(
        'text-xs text-[#7A7371] hover:text-[#BC8477]',
        'text-sm font-medium text-gray-500 hover:text-[#BC8477]'
    )
    content = content.replace(
        'text-[#3A3331] hover:text-[#BC8477]',
        'text-gray-900 font-bold hover:text-[#BC8477]'
    )

    with open(filepath, 'w') as f:
        f.write(content)

