const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function ytDownloader(reqUrl, videoQuality) {
  const youtube = {};
  const q = ['144', '240', '360', '480', '720', '1080'];
  const url = `${reqUrl}`;

  // Regex untuk memvalidasi url
  const regexUrl = /^((https?:\/\/)?(www.)?(youtu(be)?.(be|com))\/(watch\?v=)?)/;

  // Regex untuk mengambil nilai dari k__id
  const regexUniqId = /(?<=k__id.?=.?("|'))\w+/;

  // Regex untuk mengambil download url dari video
  const regexDownloadUrl = /(?<=<a href=")[\w:\/\/\.\?\=]+/;

  // Menentukan kualitas video
  const quality = q.includes(videoQuality)
    ? ['144', '240', '720'].includes(videoQuality)
      ? `${videoQuality}p`
      : videoQuality
    : '360';

  // Cek apakah url sudah benar
  if (!regexUrl.test(url)) throw new Error('Invalid URL');
  const videoId = url.replace(regexUrl, '').trim();
  try {
    const response = await axios({
      method: 'post',
      url: 'https://www.y2mate.com/mates/analyze/ajax',
      data: `url=https://www.youtube.com/watch?v=${videoId}&q_auto=1&ajax=1`,
    }).then((response) => response.data);
    const $ = cheerio.load(response.result);

    // Ambil title dari video
    youtube.title = $('.caption.text-left b').text().trim();

    // Ambil thumbnail dari video
    youtube.thumb = $('.thumbnail.cover img').attr('src');

    // Ambil size dari video
    youtube.size = $(`td:contains("${videoQuality}")`).next().text() || '';

    // Cek apakah ada k__id atau tidak
    if (!regexUniqId.test(response.result))
      throw new Error('Tidak dapat mendownload video');
    const uniqId = regexUniqId.exec(response.result)[0];
    const result = await axios({
      method: 'post',
      url: 'https://www.y2mate.com/mates/convert',
      data: `type=youtube&_id=${uniqId}&v_id=${videoId}&ajax=1&token=&ftype=mp4&fquality=${quality}`,
    }).then((response) => response.data);
    youtube.download_url = regexDownloadUrl.exec(result.result)[0];
    return youtube;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
