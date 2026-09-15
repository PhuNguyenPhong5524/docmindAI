export const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  if (!text) return [];
  
  const chunks = [];
  let i = 0;
  
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    // Tiến lên một khoảng, lùi lại phần overlap để gối đầu
    i += (chunkSize - overlap); 
  }
  
  return chunks;
};