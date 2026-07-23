import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  TrendingUp, 
  ArrowRight,
  MessageSquare,
  Plus,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, DrawerModal } from '../components/UI';
import { mockReviews, type Review } from '../mock/mockData';

export const ShopDetails: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { 
    shops, 
    user,
    favoriteShops, 
    setFavorite, 
    setBookingShop,
    showToast,
    resetBookingFlow
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Find shop
  const shop = shops.find(s => s.shop_id === shopId) || shops[0];
  const isFav = favoriteShops.includes(shop.shop_id);

  // Reviews state for this shop
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    return mockReviews.filter(r => r.shop_id === shop.shop_id);
  });

  // Write Review form state
  const [showWriteForm, setShowWriteForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newReviewerName, setNewReviewerName] = useState<string>(user?.name || '');
  const [newComment, setNewComment] = useState<string>('');

  // Gallery photos list (hero image + gallery photos)
  const allImages = [shop.image, ...shop.gallery];

  const handleBookAppointment = () => {
    setBookingShop(shop.shop_id);
    navigate('/app/chairs');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Book your cut at ${shop.name} on CutWala!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Shop link copied to clipboard!', 'info');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Please enter your review comment.', 'error');
      return;
    }

    const createdReview: Review = {
      review_id: `rev_${Date.now()}`,
      shop_id: shop.shop_id,
      user_name: newReviewerName.trim() || 'Verified Customer',
      user_avatar: user?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
    };

    setReviewsList(prev => [createdReview, ...prev]);
    setNewComment('');
    setShowWriteForm(false);
    showToast('Thank you! Your review has been published.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0b0c] pb-24 relative overflow-y-auto no-scrollbar">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => {
              resetBookingFlow();
              navigate('/app/home');
            }}
            className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-display font-extrabold text-base text-gray-900 dark:text-white truncate">
            {shop.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setFavorite(shop.shop_id)}
            className="p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            title="Favorite"
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. MAIN SHOP CONTENT AREA */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-5">
        
        {/* HERO MAIN IMAGE DISPLAY */}
        <div className="relative w-full h-60 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-250/20 bg-zinc-900">
          <img 
            src={allImages[activeImageIndex] || shop.image} 
            alt={shop.name} 
            className="w-full h-full object-cover transition-all duration-300"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Bottom Banner Strip across Poster */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-md py-2.5 px-4 text-center border-t border-white/10">
            <span className="text-xs font-bold text-white tracking-wide">
              🟢 Open Now • Working Hours: {shop.opening_time} - {shop.closing_time}
            </span>
          </div>
        </div>

        {/* HORIZONTAL PHOTO GALLERY THUMBNAILS */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Shop Photos ({allImages.length})
          </span>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {allImages.map((imgUrl, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImageIndex(idx)}
                className={`h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                  activeImageIndex === idx 
                    ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-500/20' 
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Shop photo ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SUB-INFO LINE & BADGES WITH REVIEWS BUTTON */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-350">
            
            {/* CLICKABLE REVIEWS RATING BUTTON */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-1 font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors cursor-pointer bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm"
              title="Click to view reviews"
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{shop.rating} ({120 + reviewsList.length}+ reviews)</span>
              <MessageSquare className="h-3.5 w-3.5 text-orange-500 ml-1" />
            </button>

            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" /> SOMA, San Francisco
            </span>
            <span>•</span>
            <span className="font-bold text-amber-500">0.4 mi</span>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              AIR CONDITIONED
            </span>
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              FREE ESPRESSO & BEER
            </span>
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              HIGH SPEED WIFI
            </span>
          </div>
        </div>

        {/* TAGLINE / DESCRIPTION */}
        <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic border-l-2 border-amber-500 pl-3 py-0.5">
          "{shop.description}"
        </p>

        {/* REVIEWS & RATINGS SECTION CARD */}
        <div className="flex flex-col gap-3.5 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Customer Ratings & Reviews
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                {shop.rating} ★ Rating ({120 + reviewsList.length} verified reviews)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewModalOpen(true);
                setShowWriteForm(true);
              }}
              className="px-3 py-1.5 text-xs font-black rounded-xl bg-orange-500 hover:bg-orange-600 text-white border-none cursor-pointer flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write Review</span>
            </Button>
          </div>

          {/* Sample Latest Review Preview */}
          {reviewsList.length > 0 && (
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-800 flex flex-col gap-1.5 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={reviewsList[0].user_avatar} alt={reviewsList[0].user_name} className="h-6 w-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{reviewsList[0].user_name}</span>
                </div>
                <div className="flex items-center text-amber-500 text-xs font-extrabold">
                  {'★'.repeat(reviewsList[0].rating)}
                </div>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-300 italic line-clamp-2">
                "{reviewsList[0].comment}"
              </p>
            </div>
          )}

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="text-xs font-extrabold text-orange-500 hover:text-orange-600 text-center cursor-pointer pt-1 underline"
          >
            View all {120 + reviewsList.length} reviews & ratings →
          </button>
        </div>

        {/* TRENDING HYPE BOX */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider shrink-0 shadow-sm">
            <TrendingUp className="h-3.5 w-3.5" /> Trending
          </div>
          <span className="font-bold text-blue-700 dark:text-blue-300 text-xs">
            42 grooming appointments booked in last 24 hours
          </span>
        </div>

      </div>

      {/* 3. FIXED BOTTOM FULL-WIDTH BOOK APPOINTMENT BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto w-full">
          <Button
            variant="primary"
            onClick={handleBookAppointment}
            className="w-full h-12 text-sm font-extrabold rounded-2xl cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 border-none flex items-center justify-center gap-2"
          >
            <span>Book Appointment</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 4. REVIEWS & RATINGS DRAWER MODAL */}
      <DrawerModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Reviews & Ratings (${shop.name})`}
      >
        <div className="flex flex-col gap-4 pt-2">
          
          {/* Header Action: Toggle Write Form */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <div>
              <span className="text-xs font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                ⭐ {shop.rating} Overall Rating
              </span>
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 block font-medium">
                Based on {120 + reviewsList.length} customer reviews
              </span>
            </div>
            <button
              onClick={() => setShowWriteForm(!showWriteForm)}
              className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-extrabold cursor-pointer hover:bg-orange-600 transition-all flex items-center gap-1 shadow-md active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showWriteForm ? 'Close Form' : 'Write Review'}</span>
            </button>
          </div>

          {/* WRITE A REVIEW FORM */}
          {showWriteForm && (
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-500/30 shadow-lg animate-fade-in">
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                Write Your Review
              </h4>

              {/* STAR RATING PICKER */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= newRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviewer Name */}
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white outline-none focus:border-orange-500"
              />

              {/* Review Comment */}
              <textarea
                rows={3}
                placeholder="Share your haircut & service experience at this shop..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 resize-none"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer shadow-md"
              >
                Submit Review
              </Button>
            </form>
          )}

          {/* REVIEWS LIST */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Customer Reviews ({reviewsList.length})
            </span>

            {reviewsList.map((rev) => (
              <div
                key={rev.review_id}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800 flex flex-col gap-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.user_avatar}
                      alt={rev.user_name}
                      className="h-8 w-8 rounded-full object-cover border border-orange-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {rev.user_name}
                        </span>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-amber-500 text-xs font-black">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </DrawerModal>

    </div>
  );
};
