"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BreadCrum from "./BreadCrum";
import { useSelector, useDispatch } from "react-redux";
import { getYachts, deleteYachts, publishYacht } from "@/lib/Features/Yachts/yachtsSlice";
import type { RootState, AppDispatch } from '@/lib/Store/store';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdOutlineBathroom, MdClose } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoPersonSharp } from "react-icons/io5";


const YachtsDetail = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { allYachts, getLoading, totalPages, total } = useSelector((state: RootState) => state.yachts);
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPage = 10;
  const [yachtsToDelete, setYachtsToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishingYachtId, setPublishingYachtId] = useState<string | null>(null);
  const [yachtToPublish, setYachtToPublish] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(getYachts({ page: currentPages, limit: itemsPerPage }));
  }, [currentPages, itemsPerPage, dispatch]);


  const filteredData = allYachts
    .filter(yachts =>
      yachts?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  const isFiltering = searchTerm.trim() !== '';
  const currentItems = filteredData;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPages(newPage);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | string)[] = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, "...", totalPages - 1, totalPages);
    }
    return pages.map((p, index) => (
      <button
        key={index}
        className={`w-[35px] h-[35px] rounded-full border cursor-pointer ${currentPages === p ? "bg-[#012A50] text-white" : "bg-white text-[#012A50]"
          }`}
        onClick={() => typeof p === "number" && handlePageChange(p)}
        disabled={p === "..."}
      >
        {p}
      </button>
    ));
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setYachtsToDelete(id);
    setIsModalOpen(true);
  };

  const handlePublishClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (publishingYachtId === id) return;
    setYachtToPublish(id);
    setIsPublishModalOpen(true);
  };

  const handleConfirm = () => {
    if (yachtsToDelete) {
      dispatch(deleteYachts(yachtsToDelete))
        .unwrap()
        .then(() => {
          toast.success("Yacht deleted successfully");
          setIsModalOpen(false);
          dispatch(getYachts({ page: currentPages, limit: itemsPerPage }));
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete yacht");
        });
    }
    setIsModalOpen(false);
  };

  const handlePublishConfirm = async () => {
    if (yachtToPublish) {
      setPublishingYachtId(yachtToPublish);
      try {
        const resultAction = await dispatch(publishYacht({ yachtId: yachtToPublish, status: "published" }));
        if (publishYacht.fulfilled.match(resultAction)) {
          toast.success("Yacht published successfully");
        } else if (publishYacht.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as {
            error: { message: string };
          };
          toast.error(errorPayload?.error?.message || "Failed to publish yacht.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred");
      } finally {
        setPublishingYachtId(null);
      }
    }
    setIsPublishModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePublishCancel = () => {
    setIsPublishModalOpen(false);
  };

  return (
    <>
      <div>
        <BreadCrum onSearch={setSearchTerm} />
        {getLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.5rem)]">
            <div className="w-10 h-10 border-3 border-t-transparent border-[#012A50] rounded-full animate-spin" />
          </div>
        ) : isFiltering && currentItems.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-14.5rem)] text-lg text-[#012A50]">
            No data available.
          </div>
        ) : allYachts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[12px]">
            {currentItems.map((yachtItem, yachtIndex) => {
              const Box = [
                {
                  id: 1,
                  img: "/images/Home/featured-ft.svg",
                  label: yachtItem?.length ? `${yachtItem.length} ft` : null,
                },
                {
                  id: 2,
                  icon: IoPersonSharp,
                  label: yachtItem?.passengerDayTrip ? `${yachtItem.passengerDayTrip}` : null,
                },
                {
                  id: 3,
                  icon: IoPersonSharp,
                  label: yachtItem?.passengerOvernight ? `${yachtItem.passengerOvernight}` : null,
                },
              ];
              const Cabins = [
                {
                  id: 1,
                  icon: MdOutlineBathroom,
                  label: yachtItem?.bathrooms ? `with ${yachtItem.bathrooms} Bathrooms` : null,
                },
                {
                  id: 2,
                  img: "/images/Home/featured-cabin.svg",
                  label: yachtItem?.cabins ? `${yachtItem.cabins} Cabins` : null,
                },
              ];
              return (
                <div
                  key={yachtIndex}
                  className="bg-white border border-[#CECECE] rounded-lg shadow-md py-4 px-2 flex gap-4 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/yachts/${yachtItem._id}`)}
                >
                  {/* Left side - Main image with tag */}
                  <div className="relative w-[45%] overflow-hidden rounded-tl-3xl rounded-br-3xl">
                    <Image
                      src={yachtItem?.primaryImage}
                      alt="Yacht image"
                      width={300}
                      height={258}
                      className="w-full h-[260px] object-cover"
                    />
                    {/* Day charter tag on top of image */}
                    <div className="absolute w-full bottom-0 rounded-tl-4xl bg-[#034250] text-white px-3 py-4 text-sm font-medium flex items-center gap-1">
                      <p className="text-right font-extrabold font-plusjakarta text-base gradient-text w-full me-5">
                        {yachtItem?.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex flex-col justify-between flex-1">
                    {/* Top section with title and edit button */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-plusjakarta font-extrabold text-[20px] text-[#0061B1] flex-1">{yachtItem.title}</h3>
                      </div>
                      <div>
                        <p className="text-[#3D3D3D] font-normal text-[13px] font-plusjakarta">
                          Starting from
                        </p>
                        <p className="text-[#C3974C] font-plusjakarta font-extrabold text-[18px]">
                          €{yachtItem.daytripPriceEuro}
                        </p>
                      </div>
                    </div>

                    {/* Specs tags */}
                    <div className="flex items-center gap-3 mt-2">
                      {Box.map((ft, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 py-2 px-3 border border-[#E8E8E8] bg-white rounded-lg"
                          style={{ boxShadow: "0px 4px 24px 0px #B5B5B540" }}
                        >
                          {ft.img && (
                            <Image src={ft.img} alt={`Yacht image ${index + 1}`} width={16} height={16} />
                          )}
                          {ft.icon && <ft.icon className="text-[#122B3F] text-[16px]" />}
                          <span className="font-normal text-[14px] text-[#1A2C37] font-plusjakarta">{ft.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cabin info */}
                    <div className="flex gap-2 mt-3 items-center">
                      {Cabins.map((sk, index) => (
                        <div key={index} className="flex items-center gap-2 py-2 px-3 border border-[#E8E8E8] bg-white rounded-lg"
                          style={{ boxShadow: "0px 4px 24px 0px #B5B5B540" }}>
                          {sk.img && <Image src={sk.img} alt={`Yacht image ${index + 1}`} width={12} height={12} />}
                          {sk.icon && <sk.icon className="text-[#122B3F] text-[16px]" />}
                          <span className="font-plusjakarta font-normal text-[13px] text-[#6D6D6D]">{sk.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Gallery images */}
                    <div className="flex gap-2 mt-3 items-center">
                      {yachtItem.galleryImages.slice(0, 3).map((sk, index) => (
                        <div key={index} className="flex items-center relative">
                          <Image
                            src={sk}
                            alt={`Yacht image ${index + 1}`}
                            width={54}
                            height={44}
                            className="rounded-md w-[54px] h-[44px] object-cover"
                          />
                        </div>
                      ))}
                      {yachtItem.galleryImages.length > 6 && (
                        <div className="relative">
                          <Image
                            src={yachtItem.galleryImages[6]}
                            alt="Yacht image see all"
                            width={54}
                            height={44}
                            className="rounded-md w-[54px] h-[44px] object-cover"
                          />
                          <div className="absolute inset-0 bg-[#0C0C0C]/70 rounded-md flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{yachtItem.galleryImages.length - 6}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons below gallery */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/yachts/${yachtItem._id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        onClick={(e) => handleDeleteClick(e, yachtItem._id)}
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => handlePublishClick(e, yachtItem._id)}
                        disabled={publishingYachtId === yachtItem._id}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors
                            ${publishingYachtId === yachtItem._id
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : yachtItem.status === "published"
                              ? "bg-green-500 text-white cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                          }`}
                      >
                        {publishingYachtId === yachtItem._id
                          ? "Publishing..."
                          : yachtItem.status === "published"
                            ? "Published"
                            : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-lg text-[#012A50]">
            No data available.
          </div>
        )}
        <div className="flex justify-center mt-10">
          {total > 10 && !isFiltering && !getLoading && (
            <div className="flex gap-2 items-center">
              {currentPages > 1 && (
                <button
                  className="w-[35px] h-[35px] text-[16px] cursor-pointer text-[#012A50] flex justify-end items-center"
                  onClick={() => handlePageChange(currentPages - 1)}
                >
                  <FaChevronLeft />
                </button>
              )}
              {renderPagination()}
              {currentPages < totalPages && (
                <button
                  className="w-[35px] h-[35px] text-[16px] cursor-pointer text-[#012A50]"
                  onClick={() => handlePageChange(currentPages + 1)}
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#BABBBB]/40 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold text-center">
                Are you sure you want to delete?
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <button
                  onClick={handleConfirm}
                  className="px-[16px] py-[7px] border border-[#DB2828] text-[#DB2828] rounded-full font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <TiTick />
                  Yes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-[16px] py-[7px] border border-[#2185D0] text-[#989898] hover:text-[#2185D0] rounded-full transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <MdClose />
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {isPublishModalOpen && !publishingYachtId && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#BABBBB]/40 bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-lg font-semibold text-center">
                Are you sure you want to publish this yacht?
              </h2>
              <div className="flex justify-center items-center gap-3 mt-3">
                <button
                  onClick={handlePublishConfirm}
                  className="px-[16px] py-[7px] border border-[#00B374] text-[#00B374] rounded-full font-medium flex items-center justify-center gap-1 cursor-pointer"
                >
                  <TiTick />
                  Yes
                </button>
                <button
                  onClick={handlePublishCancel}
                  className="px-[16px] py-[7px] border border-[#2185D0] text-[#989898] hover:text-[#2185D0] rounded-full transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <MdClose />
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default YachtsDetail;