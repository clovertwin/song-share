interface ButtonProps {
  handleSearchTypeSelect: (type: string) => void;
  searchType: string;
  selected: boolean;
}

export default function SelecterButton({
  handleSearchTypeSelect,
  searchType,
  selected,
}: ButtonProps) {
  return (
    <button
      onClick={() => handleSearchTypeSelect(searchType)}
      className={`border-2 ${
        selected
          ? `border-gray-700 text-white`
          : `border-gray-800 text-gray-500`
      } rounded-md py-1 px-3 text-xs sm:text-sm sm:px-5 xl:px-10 active:bg-gray-900 hover:border-gray-700 focus:outline-none focus:border-gray-700 hover:cursor-pointer hover:text-white`}
    >
      {searchType === "artist"
        ? "Artists"
        : searchType === "album"
        ? "Albums"
        : searchType === "song"
        ? "Songs"
        : searchType === "show"
        ? "Shows"
        : null}
    </button>
  );
}
