export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const generateUserColor = (userId) => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
};