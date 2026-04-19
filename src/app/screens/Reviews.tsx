import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, ThumbsUp, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

export function Reviews() {
  const navigate = useNavigate();
  const { chargerId } = useParams();

  const reviewData = {
    chargerName: "BGC Central",
    averageRating: 4.8,
    totalReviews: 127,
    breakdown: [
      { stars: 5, count: 95, percentage: 75 },
      { stars: 4, count: 25, percentage: 20 },
      { stars: 3, count: 5, percentage: 4 },
      { stars: 2, count: 1, percentage: 0.8 },
      { stars: 1, count: 1, percentage: 0.2 },
    ],
  };

  const reviews = [
    {
      id: 1,
      user: "Maria Santos",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      rating: 5,
      date: "Mar 5, 2026",
      comment:
        "Perfect location in BGC! Host was very responsive and the charger worked flawlessly. Will definitely book again.",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: "Carlos Reyes",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      rating: 5,
      date: "Mar 3, 2026",
      comment:
        "Great spot for charging while working nearby. Covered parking is a big plus during rainy season.",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      user: "Anna Cruz",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      rating: 4,
      date: "Feb 28, 2026",
      comment:
        "Good charger, reliable and safe area. Only minor issue was finding the exact parking spot, but host helped via chat.",
      helpful: 5,
      verified: true,
    },
    {
      id: 4,
      user: "Miguel Torres",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      rating: 5,
      date: "Feb 25, 2026",
      comment:
        "Excellent! Used it during off-peak hours and saved a lot. Fast charging and convenient location.",
      helpful: 15,
      verified: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] max-w-md mx-auto pb-8">
      {/* Header */}
      <div className="bg-[#111827]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h1 className="font-semibold text-white">Reviews</h1>
          <p className="text-sm text-gray-400">{reviewData.chargerName}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Rating Summary */}
        <Card className="p-6 bg-white/5 border-white/5">
          <div className="flex items-start gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-1 text-white">
                {reviewData.averageRating}
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= reviewData.averageRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                {reviewData.totalReviews} reviews
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {reviewData.breakdown.map((item) => (
                <div
                  key={item.stars}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-8 text-gray-300">{item.stars}★</span>
                  <Progress value={item.percentage} className="h-2 flex-1" />
                  <span className="w-8 text-gray-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Reviews List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-white">Community Reviews</h2>

          {reviews.map((review) => (
            <Card key={review.id} className="p-4 bg-white/5 border-white/5">
              <div className="flex gap-3">
                <Avatar className="ring-2 ring-green-400/30">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{review.user}</p>
                        {review.verified && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-400/20 text-green-400 border-green-400/30"
                          >
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{review.comment}</p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-400 hover:text-green-400 hover:bg-white/5"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Review CTA */}
        <Card className="p-4 bg-green-400/10 border-green-400/20">
          <p className="text-sm text-green-300 mb-3">
            Have you used this charger? Share your experience!
          </p>
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold">
            Write a Review
          </Button>
        </Card>
      </div>
    </div>
  );
}
