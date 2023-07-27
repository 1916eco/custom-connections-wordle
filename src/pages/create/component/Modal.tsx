import type { GameWords } from "@prisma/client";
import { FunctionComponent } from "react";

interface ModalProps {
  game: GameWords;
  setOpenModal: (openModal: boolean) => void;
}

const Modal: FunctionComponent<ModalProps> = ({ game, setOpenModal }) => {
  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(
      `http://localhost:3000/custom-game/${game.id}`
    );
  };

  return game ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          X
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <div className="flex flex-row">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-headline"
                  >
                    Game created!
                  </h3>

                  <p
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={() => setOpenModal(false)}
                  >
                    X
                  </p>
                </div>
                {/* close button */}

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You can now share the link with your friends and play the
                    game together.
                  </p>

                  <br />
                  <a
                    className="text-blue-500"
                    target="_blank"
                    href={`http://localhost:3000/custom-game/${game.id}`}
                  >
                    {`http://localhost:3000/custom-game/${game.id}`}
                  </a>
                  {/* copy to clipboard  */}
                  <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={() => void handleCopyToClipboard()}
                  >
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
