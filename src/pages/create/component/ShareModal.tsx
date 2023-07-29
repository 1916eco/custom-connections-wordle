import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GameWords } from "@prisma/client";
import { FunctionComponent } from "react";
import { useCopyToClipboard } from "react-use";
import { notifyToasterSuccess } from "~/utils/toaster";

interface ShareModalProps {
  game: GameWords;
  setOpenModal: (openModal: boolean) => void;
  openModal: boolean;
}

const ShareModal: FunctionComponent<ShareModalProps> = ({
  game,
  setOpenModal,
  openModal,
}) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const handleCopyToClipboard = () => {
    copyToClipboard(`${process.env.WEBSITE_URL}/custom-game/${game.id}`);
    notifyToasterSuccess("Copied to clipboard");
  };

  return game ? (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent className="bg-white ">
        <DialogHeader title="Share your game" />
        <DialogTitle
          className="text-lg font-medium leading-6 text-gray-900"
          id="modal-headline"
        >
          Game created!
        </DialogTitle>

        {/* close button */}
        <DialogDescription>
          <p className="text-sm text-gray-500">
            You can now share the link with your friends and play the game
            together.
          </p>

          <br />
        </DialogDescription>
        <a
          className="text-blue-500"
          target="_blank"
          href={`https://custom-connections-wordle.vercel.app/custom-game/${game.id}`}
        >
          {`https://custom-connections-wordle.vercel.app/custom-game/${game.id}`}
        </a>
        {/* {/* copy to clipboard  */}
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => void handleCopyToClipboard()}
        >
          Copy to clipboard
        </button>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default ShareModal;
