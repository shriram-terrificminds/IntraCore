
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
  'Gestures': ['👍', '👎', '👌', '🤞', '✌️', '🤟', '🤘', '👏', '🙌', '👐', '🤝', '🙏', '✊', '👊', '🤛', '🤜'],
  'Objects': ['💼', '📝', '📊', '📈', '📉', '🎯', '💡', '🔔', '📢', '📣', '⏰', '📅', '📆', '🎉', '🎊', '✨'],
  'Symbols': ['❤️', '💙', '💚', '💛', '🧡', '💜', '🤍', '🖤', '💯', '✅', '❌', '⭐', '🔥', '💪', '🚀', '⚡']
};

export function EmojiPicker({ onEmojiSelect }) {
  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-3">
        <div className="space-y-3">
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent"
                    onClick={() => onEmojiSelect(emoji)}
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
