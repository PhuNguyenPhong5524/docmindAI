

const BoxLeftContent = () => {
  return (
    <section className="lg:w-[55%] w-full h-auto bg-[#eff4ff] py-4 px-14 flex flex-col justify-between relative">
        <div className="relative z-10 space-y-6">
        <p className="text-xs text-[#4f46e5] font-medium tracking-wide uppercase">
            Hỏi đáp tài liệu thông minh với AI
        </p>
        <h1 className="text-2xl sm:text-3xl text-[#0b1c30] font-extrabold tracking-tight ">
            Hiểu tài liệu nhanh hơn với sức mạnh của AI
        </h1>
        <p className="text-base text-[#464555] max-w-xl p-0 m-0 leading-relaxed">
            Tải lên tài liệu PDF, đặt câu hỏi bằng
            ngôn ngữ tự nhiên và nhận câu trả lời
            dựa trên chính nội dung tài liệu của bạn
            với nguồn trích dẫn minh bạch từng trang.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-2">

            {[
            {
                icon: "chat",
                label:
                "Hỏi đáp trực tiếp trên tài liệu",
            },
            {
                icon:
                "bookmark_check",
                label:
                "Trích dẫn chính xác theo trang",
            },
            {
                icon:
                "auto_awesome",
                label:
                "Tóm tắt nội dung bằng AI",
            },
            {
                icon: "compare",
                label:
                "So sánh nhiều tài liệu",
            },
            {
                icon: "history",
                label:
                "Lưu lịch sử hội thoại",
            },
            ].map(
            (item, idx) => (
                <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-[2px] rounded-full bg-[#d3e4fe] text-[#0b1c30] text-xs shadow-sm"
                >
                <span className="material-symbols-outlined !text-[18px] text-[#4f46e5]">
                    {item.icon}
                </span>

                {item.label}
                </span>
            )
            )}

        </div>


        {/* =========================
            LIVE CHAT PREVIEW
        ========================== */}

        <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-sm space-y-1 border border-indigo-50/50">

            {/* Pipeline */}
            <div className="flex items-center justify-between overflow-x-auto pb-2 text-[11px] text-[#464555] font-medium">

            <span className="inline-flex items-center gap-1 text-[#4f46e5] font-semibold">
                <span className="material-symbols-outlined text-[14px]">
                picture_as_pdf
                </span>

                PDF Documents
            </span>


            <span className="material-symbols-outlined text-[12px] text-gray-400">
                arrow_forward
            </span>


            <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                token
                </span>

                Vector Chunks
            </span>


            <span className="material-symbols-outlined text-[12px] text-gray-400">
                arrow_forward
            </span>


            <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                manage_search
                </span>

                Semantic Search
            </span>


            <span className="material-symbols-outlined text-[12px] text-gray-400">
                arrow_forward
            </span>


            <span className="inline-flex items-center gap-1 text-[#4f46e5] font-semibold">

                <span className="material-symbols-outlined text-[14px]">
                verified
                </span>

                Source Citation

            </span>

            </div>


            {/* Chat */}
            <div className="space-y-3 pt-2">

            {/* User */}
            <div className="flex items-start justify-end gap-2">

                <div className="bg-[#4f46e5] text-white px-3.5 py-2 rounded-xl rounded-tr-none text-xs shadow-sm max-w-[85%]">
                Điều kiện xét tốt nghiệp là gì?
                </div>


                <span className="w-6 h-6 rounded-full bg-[#dce9ff] flex items-center justify-center text-[12px] text-[#0b1c30] font-semibold shrink-0">
                U
                </span>

            </div>


            {/* AI */}
            <div className="flex items-start gap-2.5">

                <div className="w-6 h-6 rounded-md bg-[#4f46e5] flex items-center justify-center text-white text-[12px] shrink-0">

                <span className="material-symbols-outlined text-[14px]">
                    psychology
                </span>

                </div>


                <div className="bg-[#eff4ff] text-[#0b1c30] px-4 py-3 rounded-xl rounded-tl-none text-xs space-y-2.5 max-w-[90%]">

                <p className="leading-relaxed">
                    Theo tài liệu đã chọn,
                    sinh viên cần hoàn thành đầy đủ
                    chương trình đào tạo và đáp ứng
                    các điều kiện theo quy định
                    chuẩn đầu ra ngoại ngữ, tin học.
                </p>


                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e1e0ff] text-[#3323cc] text-xs shadow-sm">

                    <span className="material-symbols-outlined text-[14px]">
                    description
                    </span>


                    <span className="font-medium">
                    Quy_che_dao_tao_UIT.pdf
                    </span>


                    <span className="text-[#464555]">
                    · Trang 23
                    </span>


                    <span className="bg-[#4f46e5] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    #Mục 4.2
                    </span>

                </div>

                </div>

            </div>

            </div>


            {/* Accuracy */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#464555]">

            <span className="inline-flex items-center gap-1">

                <span className="material-symbols-outlined text-[#4f46e5] text-[16px]">
                verified_user
                </span>

                <strong className="text-[#0b1c30]">
                99.4%
                </strong>

                Độ chính xác trích dẫn

            </span>


            <span className="inline-flex items-center gap-1">

                <span className="material-symbols-outlined text-[#4f46e5] text-[16px]">
                view_column
                </span>

                Hỗ trợ PDF đa cột &amp; bảng biểu

            </span>

            </div>

        </div>

        </div>


        {/* Footer */}
        <div className="relative z-10 mt-2 flex items-center justify-between text-xs text-[#464555]">

        <span>
            Bảo mật dữ liệu chuẩn SOC2 &amp; GDPR
        </span>

        <span className="font-mono">
            v2.4.0-prod
        </span>

        </div>

    </section>
  )
}

export default BoxLeftContent;