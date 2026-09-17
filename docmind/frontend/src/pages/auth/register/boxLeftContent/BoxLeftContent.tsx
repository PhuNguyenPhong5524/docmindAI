
const BoxLeftContent = () => {
  return (
    <section className="lg:w-[55%] w-full bg-[#eff4ff] p-8 sm:p-12 lg:py-8 lg:px-14 flex flex-col justify-between relative">

      {/* Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />


      <div className="relative z-10 flex flex-col gap-6">

        {/* BRAND */}

        <div className="flex items-center justify-between flex-wrap gap-3">


          <span className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#3323cc] text-xs font-medium shadow-sm flex items-center gap-1">

            <span className="material-symbols-outlined text-sm">
              person_add
            </span>

            Đăng ký thành viên mới

          </span>

        </div>


        {/* TITLE */}

        <div className="space-y-2 max-w-xl">

          <h1 className="text-3xl sm:text-4xl text-[#0b1c30] font-extrabold tracking-tight leading-tight">

            Bắt đầu khai phóng tri thức
            từ tài liệu của bạn

          </h1>

          <p className="text-base text-[#464555] leading-relaxed">

            Chỉ mất 30 giây để tạo tài khoản.
            Tận hưởng trợ lý AI phân tích tài liệu
            PDF thông minh với khả năng RAG
            tiên tiến nhất.

          </p>

        </div>


        {/* FEATURES */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">

            <div className="w-9 h-9 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">

              <span className="material-symbols-outlined text-xl">
                auto_stories
              </span>

            </div>

            <div>

              <p className="text-xs font-semibold text-[#0b1c30]">
                Phân tích PDF không giới hạn
              </p>

              <p className="text-xs text-[#464555] mt-0.5">
                Xử lý đa chuyên ngành: luật,
                tài chính, kỹ thuật, y khoa.
              </p>

            </div>

          </div>


          <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">

            <div className="w-9 h-9 rounded-lg bg-[#e1e0ff] flex items-center justify-center text-[#4648d4] shrink-0">

              <span className="material-symbols-outlined text-xl">
                find_in_page
              </span>

            </div>

            <div>

              <p className="text-xs font-semibold text-[#0b1c30]">
                Trích xuất kèm số trang 100%
              </p>

              <p className="text-xs text-[#464555] mt-0.5">
                Mọi câu trả lời đều có trích dẫn
                nguồn chuẩn xác, chống ảo giác.
              </p>

            </div>

          </div>


          <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">

            <div className="w-9 h-9 rounded-lg bg-[#c9e6ff] flex items-center justify-center text-[#004d70] shrink-0">

              <span className="material-symbols-outlined text-xl">
                encrypted
              </span>

            </div>

            <div>

              <p className="text-xs font-semibold text-[#0b1c30]">
                Bảo mật chuẩn doanh nghiệp
              </p>

              <p className="text-xs text-[#464555] mt-0.5">
                Mã hóa AES-256 đầu cuối,
                tuân thủ lưu trữ dữ liệu cách ly.
              </p>

            </div>

          </div>


          <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">

            <div className="w-9 h-9 rounded-lg bg-[#d3e4fe] flex items-center justify-center text-[#4f46e5] shrink-0">

              <span className="material-symbols-outlined text-xl">
                credit_card_off
              </span>

            </div>

            <div>

              <p className="text-xs font-semibold text-[#0b1c30]">
                Miễn phí trải nghiệm ngay
              </p>

              <p className="text-xs text-[#464555] mt-0.5">
                Không yêu cầu thẻ tín dụng,
                kích hoạt không gian làm việc tức thì.
              </p>

            </div>

          </div>

        </div>


        {/* RAG WORKFLOW */}

        <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />

              <span className="text-xs uppercase tracking-wider font-semibold text-[#464555]">
                Quy trình RAG Architecture
              </span>

            </div>

            <span className="font-mono text-xs text-[#3525cd] font-medium">
              Multi-vector Indexing
            </span>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">

            {[
              {
                number: "01",
                icon: "upload_file",
                title: "Tải PDF",
                text: "OCR & cấu trúc hóa",
              },
              {
                number: "02",
                icon: "hub",
                title: "Vectorize",
                text: "Chunking & Embeddings",
              },
              {
                number: "03",
                icon: "psychology",
                title: "Hỏi đáp",
                text: "Truy vấn ngữ nghĩa sâu",
              },
              {
                number: "04",
                icon: "verified",
                title: "Trích dẫn",
                text: "Kiểm chứng từng câu",
              },
            ].map(
              (item) => (
                <div
                  key={item.number}
                  className="p-3 bg-[#eff4ff] rounded-lg flex flex-col gap-1"
                >

                  <div className="flex items-center justify-between text-[#464555]">

                    <span className="font-mono text-xs text-[#3525cd] font-semibold">
                      {item.number}
                    </span>

                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>

                  </div>


                  <span className="text-xs font-semibold text-[#0b1c30]">
                    {item.title}
                  </span>

                  <span className="text-[11px] text-[#464555] leading-tight">
                    {item.text}
                  </span>

                </div>
              )
            )}

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="relative z-10 flex items-center gap-2 text-[#464555] mt-6">

        <span className="material-symbols-outlined text-base text-[#4f46e5]">
          verified_user
        </span>

        <span className="text-xs">
          Được tin dùng bởi hơn 25,000+
          chuyên gia pháp lý, nghiên cứu sinh
          và nhà phân tích dữ liệu.
        </span>

      </div>

    </section>
  );
};


export default BoxLeftContent;