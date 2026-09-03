export function filtrarConExcludes(files, patterns) {
  const excludes = patterns.filter(p => p.startsWith(':(exclude)')).map(p => p.replace(':(exclude)',''));
  const includes = patterns.filter(p =>!p.startsWith(':(exclude)'));
  return files.filter(f => {
    if (excludes.some(ex => f.startsWith(ex))) return false;
    if (!includes.length) return true;
    return includes.some(inc => f.startsWith(inc));
  });
}

export function getCommonPrefix(patterns) {
  const positives = patterns.filter(p =>!p.startsWith(':(exclude)'));
  if (!positives.length) return '';
  let pref = positives.reduce((a,b) => {
    let i=0; while(i<a.length && i<b.length && a[i]===b[i]) i++;
    return a.slice(0,i);
  });
  // Recortar al último slash para devolver directorio común
  const slash = pref.lastIndexOf('/');
  return slash >= 0? pref.slice(0, slash+1) : pref;
}
