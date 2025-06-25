import { useState } from "react";
// import Image from "next/image";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import MapView from "@/components/MapView";
import TimelineView from "@/components/TimelineView";
import AddPinModal from "@/components/AddPinModal";
import PinGalleryModal from "@/components/PinGalleryModal";
import { usePins } from "@/hooks/usePins";
import { TravelPin } from "@/types";

/**
 * A sleek, modern landing + dashboard page for PicJourni.
 *
 * - When a user is **not** logged‑in it shows a marketing‑style landing page
 *   with two hero images (world map + traveller holding phone). Clicking
 *   anywhere in the hero or on the CTA button opens the AuthModal.
 * - Once authenticated, users are dropped straight into the familiar map /
 *   timeline UI.
 *
 * Replace the Unsplash URLs below with your own hosted assets if desired.
 */

const mapboxToken =
  "pk.eyJ1IjoiaGVtcGJveGMiLCJhIjoiY21jOG8wc2d2MXNvMDJpcTBtanJ3YWN4dCJ9.Glj_yu33MTij9gcdVD0h_Q";

const heroImages = [
  {
    src: " https://i.pinimg.com/736x/74/5a/82/745a822204b4858b543791e0152feb23.jpg?auto=format&fit=crop&w=900&q=60",
    alt: "Stylised world map",
  },
  {
    src: "https://cdn.stocksnap.io/img-thumbs/960w/camera-girl_WJL4RY6N6Z.jpg?auto=format&fit=crop&w=900&q=60",
    alt: "Traveller holding a smartphone",
  },
];

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { pins, loading: pinsLoading, addPin } = usePins();

  const [currentView, setCurrentView] = useState<"map" | "timeline">("map");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Add‑Pin modal
  const [addPinModalOpen, setAddPinModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Gallery modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<TravelPin | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedLocation({ lat, lng });
    setAddPinModalOpen(true);
  };

  const handlePinClick = (pin: TravelPin) => {
    setSelectedPin(pin);
    setGalleryModalOpen(true);
  };

  const handleSavePin = async (pinData: {
    title: string;
    description: string;
    visitDate: Date;
    photos: File[];
  }) => {
    if (!selectedLocation) return;
    await addPin(selectedLocation.lat, selectedLocation.lng, pinData);
    setAddPinModalOpen(false);
    setSelectedLocation(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-4" />
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  /*** ────────────────────────────────
   *
   *  ✨ MARKETING LANDING (NOT LOGGED IN)
   *
   */
  if (!user) {
    return (
      <>
        {/* NAV BAR */}
        <header className="h-16 px-6 flex items-center justify-between bg-transparent absolute inset-x-0 top-0 z-30">
          <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
            <MapPin className="w-6 h-6 text-orange-600" />
            PicJourni
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:brightness-110 focus-visible:ring-4 focus-visible:ring-orange-300 transition"
          >
            Log in / Sign up
          </button>
        </header>

        {/* HERO SECTION */}
        <main
          className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-16 relative overflow-hidden"
          onClick={() => setAuthModalOpen(true)}
        >
          {/* Background gradient blobs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-100 blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-red-100 blur-3xl opacity-50" />

          <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 leading-tight max-w-3xl">
            Pin your memories. <br className="hidden md:inline" /> Relive every journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">PicJourni</span>.
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center max-w-2xl">
            A simple, beautiful way to capture photos, write stories, and track everywhere you've been on an interactive map.
          </p>

          {/* CTA */}
          <button
            className="mt-8 px-10 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-transform"
          >
            Start Your Journey
          </button>

          {/* HERO IMAGES */}
          <div className="relative mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            {heroImages.map(({ src, alt }, i) => (
              <div
                key={src}
                className="relative aspect-video rounded-3xl overflow-hidden ring-1 ring-gray-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
              >
                {/* <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`object-cover ${i === 0 ? "md:rotate-[-2deg]" : "md:rotate-[2deg]"}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                /> */}
                 <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover absolute inset-0 ${i === 0 ? "md:rotate-[-2deg]" : "md:rotate-[2deg]"}`}
                  />

              </div>
            ))}
          </div>
        </main>

        {/* AUTH MODAL */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  /*** ────────────────────────────────
   *
   *  🗺️ AUTHENTICATED DASHBOARD
   *
   */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="h-[calc(100vh-4rem)]">
        {currentView === "map" ? (
          <MapView
            pins={pins}
            onMapClick={handleMapClick}
            onPinClick={handlePinClick}
            mapboxToken={mapboxToken}
          />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto">
              <TimelineView pins={pins} onPinClick={handlePinClick} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddPinModal
        isOpen={addPinModalOpen}
        onClose={() => {
          setAddPinModalOpen(false);
          setSelectedLocation(null);
        }}
        onSave={handleSavePin}
        lat={selectedLocation?.lat || 0}
        lng={selectedLocation?.lng || 0}
      />

      <PinGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => {
          setGalleryModalOpen(false);
          setSelectedPin(null);
        }}
        pin={selectedPin}
      />
    </div>
  );
}
