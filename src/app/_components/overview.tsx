"use client";
import Image from "next/image";
import { useState } from "react";

/**
 * Overview Component
 *
 * This component renders the "Overview" section of the BrainHive application, showcasing its key features with interactive visuals and descriptions.
 *
 * Features:
 * - Displays an overview of BrainHive's functionality, including:
 *   - Real-time Study Group Feed
 *   - Dynamic Search Functionality
 *   - Comprehensive Study Group Details
 *   - User Profile Management
 *   - Light and Dark Mode Support
 * - Includes interactive images that open in a modal for a closer look.
 * - Provides detailed descriptions of each feature to engage users.
 *
 * State:
 * - `selectedImage` (object | null): Tracks the currently selected image for the modal. Contains:
 *   - `src` (string): The image source URL.
 *   - `alt` (string): The image alt text for accessibility.
 *   - `width` (number): The image width.
 *   - `height` (number): The image height.
 *
 * Functions:
 * - `openModal(image)`: Opens the modal with the selected image and disables page scrolling.
 * - `closeModal()`: Closes the modal and re-enables page scrolling.
 *
 * Components:
 * - `Image`: Displays images for each feature with hover effects.
 * - Modal: Displays a larger version of the selected image in a lightbox-style overlay.
 *
 * Styling:
 * - Uses Tailwind CSS for responsive layouts and hover effects.
 * - Includes gradient overlays and transitions for interactive elements.
 *
 * Accessibility:
 * - Images include `alt` attributes for screen readers.
 * - The modal includes a close button with accessible labels.
 *
 * Behavior:
 * - Encourages user interaction with clickable images and detailed descriptions.
 * - Provides a visually appealing and responsive design for both desktop and mobile users.
 */

export default function Overview() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    width: number;
    height: number;
  } | null>(null);

  const openModal = (image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <div id="overview" className="relative py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            BrainHive Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful tools that make BrainHive the ultimate
            platform for connecting students in collaborative study
            environments.
          </p>
        </div>

        {/* Real-time Study Group Feed */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className="group cursor-pointer"
            onClick={() =>
              openModal({
                src: "/feed.png",
                alt: "Real-time Study Group Feed",
                width: 1000,
                height: 1000,
              })
            }
          >
            <div
              className="relative shadow-xl rounded-xl overflow-hidden bg-background w-full mx-auto border border-border"
              style={{
                maxWidth: "605px",
                height: "auto",
                aspectRatio: "605/450",
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none"></div>

              <div className="flex justify-center items-center h-full">
                <Image
                  src="/feed.png"
                  alt="Real-time Study Group Feed"
                  width={1000}
                  height={1000}
                  style={{
                    objectFit: "fill",
                    maxHeight: "100%",
                    width: "100%",
                    height: "auto",
                  }}
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              {/* Interactive hints */}
              <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs rounded-full px-3 py-1 z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Click to zoom
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Tap image to view details
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              Real-time Study Group Feed
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our interactive feed showcases available study groups with
              essential information at a glance. Each card displays the group
              name, subjects, creator, member count, and upcoming sessions - all
              updating in real-time. The clean, intuitive design makes it easy
              to browse and find groups that match your academic interests and
              schedule.
            </p>
          </div>
        </div>

        {/* Dynamic Search Functionality */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2 mx-auto w-full overflow-hidden">
            <div
              className="group cursor-pointer"
              onClick={() =>
                openModal({
                  src: "/searchbar.png",
                  alt: "Dynamic Search Functionality",
                  width: 1000,
                  height: 1000,
                })
              }
            >
              <div
                className="relative rounded-xl w-full overflow-hidden"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  aspectRatio: "1084/320",
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none"></div>

                <div className="flex justify-center items-center h-full">
                  <Image
                    src="/searchbar.png"
                    alt="Dynamic Search Functionality"
                    width={1000}
                    height={1000}
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Interactive hints */}
                <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs rounded-full px-3 py-1 z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Click to zoom
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Tap image to view details
              </p>
            </div>
          </div>
          <div className="md:order-1 space-y-6">
            <h3 className="text-3xl font-bold text-primary">Dynamic Search</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our powerful search functionality filters study groups as you type
              - no need to press enter. This responsive design instantly
              displays results that match your query by name, subject, or any
              relevant keyword. The dynamic filtering system makes finding the
              perfect study group quick and effortless, enhancing your overall
              experience.
            </p>
          </div>
        </div>

        {/* Comprehensive Study Group Details - Improved vertical image layout */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div
              className="group cursor-pointer"
              onClick={() =>
                openModal({
                  src: "/studygroupsidebar.png",
                  alt: "Comprehensive Study Group Details",
                  width: 1000,
                  height: 1000,
                })
              }
            >
              <div
                className="relative shadow-xl rounded-xl overflow-hidden bg-background border border-border"
                style={{
                  width: "360px",
                  maxWidth: "100%",
                  height: "auto",
                  aspectRatio: "360/520",
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none"></div>

                <div className="flex justify-center items-center h-full">
                  <Image
                    src="/studygroupsidebar.png"
                    alt="Comprehensive Study Group Details"
                    width={1000}
                    height={1000}
                    style={{
                      objectFit: "fill",
                      maxHeight: "100%",
                      width: "100%",
                      height: "auto",
                    }}
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Interactive hints */}
                <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs rounded-full px-3 py-1 z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Click to zoom
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Tap image to view details
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              Detailed Study Group Information
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              The study group sidebar provides comprehensive information about
              each group, including descriptions, subjects, scheduled sessions,
              and location details. It also features integrated access to
              When2Meet scheduling tools and meeting URLs, plus a complete
              member list with convenient join/leave functionality - everything
              you need to effectively participate in your study community.
            </p>
          </div>
        </div>

        {/* User Profile Management - Improved vertical image layout */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2 flex justify-center">
            <div
              className="group cursor-pointer"
              onClick={() =>
                openModal({
                  src: "/usersidebar.png",
                  alt: "User Profile Management",
                  width: 1000,
                  height: 1000,
                })
              }
            >
              <div
                className="relative shadow-xl rounded-xl overflow-hidden bg-background border border-border"
                style={{
                  width: "230px",
                  maxWidth: "100%",
                  height: "auto",
                  aspectRatio: "230/524",
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none"></div>

                <div className="flex justify-center items-center h-full">
                  <Image
                    src="/usersidebar.png"
                    alt="User Profile Management"
                    width={1000}
                    height={1000}
                    style={{
                      objectFit: "fill",
                      maxHeight: "100%",
                      width: "100%",
                      height: "auto",
                    }}
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Interactive hints */}
                <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs rounded-full px-3 py-1 z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Click to zoom
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Tap image to view details
              </p>
            </div>
          </div>
          <div className="md:order-1 space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              User Profile Control
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              The user sidebar gives you complete control over your BrainHive
              experience. Edit your profile information, manage study groups you
              own (with deletion options), and handle your group memberships
              (with the ability to leave groups). This centralized dashboard
              ensures you can easily maintain your academic connections and
              organize your collaborative learning activities.
            </p>
          </div>
        </div>

        {/* Light/Dark Mode - Interactive lightbox approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className="group cursor-pointer"
            onClick={() =>
              openModal({
                src: "/lightmode.png",
                alt: "Light and Dark Mode Support",
                width: 1000,
                height: 1000,
              })
            }
          >
            <div
              className="relative shadow-xl rounded-xl overflow-hidden bg-background w-full mx-auto border border-border"
              style={{
                maxWidth: "min(900px, 100%)",
                height: "auto",
                aspectRatio: "900/450",
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 group-hover:opacity-0 transition-opacity duration-300 z-10 pointer-events-none"></div>

              <div className="flex justify-center items-center h-full">
                <Image
                  src="/lightmode.png"
                  alt="Light and Dark Mode Support"
                  width={1000}
                  height={1000}
                  style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              {/* Interactive hints */}
              <div className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs rounded-full px-3 py-1 z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                Click to zoom
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Tap image to view details
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary">
              Light & Dark Mode
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              BrainHive supports both light and dark color schemes to
              accommodate your visual preferences and reduce eye strain during
              those late-night study sessions. The carefully designed interface
              maintains excellent readability and aesthetic appeal in both
              modes, ensuring a comfortable user experience at any time of day.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for larger images - Now functional */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative w-[90%] h-[90%] bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button
              className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center p-4">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
