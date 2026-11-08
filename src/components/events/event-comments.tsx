"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEventComments } from "@/hooks/use-event-feedback";
import { useUser } from "@/hooks/use-user";
import { getApiErrorMessage } from "@/lib/api-error";
import type { EventComment } from "@/types/backendTypes";

const MAX_LENGTH = 1000;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const timeAgo = (date: string) => formatDistanceToNow(parseISO(date), { addSuffix: true });

function CommentItem({ comment, onDelete }: { comment: EventComment; onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't delete the comment"));
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="text-xs bg-primary/15 text-primary">
          {comment.authorFirstName.charAt(0).toUpperCase()}
          {comment.authorLastName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">
            {capitalize(comment.authorFirstName)} {capitalize(comment.authorLastName)}
          </span>
          <time
            dateTime={comment.createdAt}
            title={new Date(comment.createdAt).toLocaleString()}
            className="text-xs text-muted-foreground"
          >
            {timeAgo(comment.createdAt)}
          </time>
          {comment.deletable && (
            <div className="ml-auto flex items-center gap-1">
              {confirming ? (
                <>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setConfirming(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <Loader2 className="size-3 animate-spin" /> : "Delete"}
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => setConfirming(true)}
                  aria-label="Delete comment"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap break-words">{comment.content}</p>
      </div>
    </li>
  );
}

export default function EventComments({ eventId }: { eventId: string }) {
  const { comments, total, loading, loadingMore, hasMore, loadMore, error, addComment, deleteComment } =
    useEventComments(eventId);
  const { user } = useUser(false);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const trimmed = content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || trimmed.length > MAX_LENGTH) return;
    setPosting(true);
    try {
      await addComment(trimmed);
      setContent("");
      toast.success("Comment posted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't post your comment"));
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card className="p-5 gap-5">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Comments
        {total > 0 && <span className="text-sm font-normal text-muted-foreground">({total})</span>}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="new-comment" className="sr-only">Write a comment</label>
          <textarea
            id="new-comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              // ctrl/cmd + enter posts the comment
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e);
            }}
            placeholder="Share your thoughts about this event..."
            rows={3}
            maxLength={MAX_LENGTH}
            className="w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {content.length}/{MAX_LENGTH}
            </span>
            <Button type="submit" size="sm" disabled={!trimmed || posting}>
              {posting && <Loader2 className="size-4 animate-spin" />}
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed px-4 py-3">
          <Link href="/login" className="text-primary hover:underline">Log in</Link> to join the conversation.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{"Couldn't load the comments."}</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <>
          <ul className="divide-y">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onDelete={() => deleteComment(comment.id)} />
            ))}
          </ul>
          {hasMore && (
            <Button variant="outline" size="sm" className="self-center" onClick={loadMore} disabled={loadingMore}>
              {loadingMore && <Loader2 className="size-4 animate-spin" />}
              Load more comments
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
