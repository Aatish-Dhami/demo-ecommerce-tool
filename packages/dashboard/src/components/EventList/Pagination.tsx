import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1 && total === 0) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Events pagination">
      <span className="pagination__info">
        Showing {startItem}-{endItem} of {total} events
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__button"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          type="button"
        >
          Previous
        </button>
        <span className="pagination__page">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          className="pagination__button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          type="button"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
