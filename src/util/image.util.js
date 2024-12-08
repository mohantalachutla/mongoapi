import process from 'process';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

//@Util
//@Input: Fromdata.Array<File>
//Get the file from the path
export const saveImage = async (filename, files) => {
  if (!getImageLocation()) {
    console.error('FILE STORE empty');
    throw new Error('Something went wrong');
  }
  if (!filename) {
    throw new Error('job id is undefined');
  }
  if (!files) {
    throw new Error('Proof of work is required');
  }
  const defaultExt = '.jpg',
    imageName = {
      before: `before${defaultExt}`,
      after: `after${defaultExt}`,
    },
    uploaded = { before: false, after: false };
  try {
    const _idDir = path.join(getImageLocation(), filename.toString());
    await fs.mkdir(_idDir.toString(), { recursive: true });
    if (files.before) {
      const buff = await fs.readFile(path.join(files.before.path)),
        image = sharp(buff),
        meta = await image.metadata(),
        { format } = meta,
        config = {
          // Quality between 1-100
          jpeg: { quality: 5 },
          // Quality between 1-100
          webp: { quality: 5 },
          // CompressionLevel between 0-9
          png: { compressionLevel: 2 },
        };
      // Save the file
      await image[format](config[format]).toFile(
        path.join(_idDir, imageName.before)
      );

      uploaded.before = true;
    }
    if (files.after) {
      const buff = await fs.readFile(path.join(files.after.path)),
        image = sharp(buff),
        meta = await image.metadata(),
        { format } = meta,
        config = {
          // Quality between 1-100
          jpeg: { quality: 5 },
          // Quality between 1-100
          webp: { quality: 5 },
          // CompressionLevel between 0-9
          png: { compressionLevel: 2 },
        };
      // Save the file
      await image[format](config[format]).toFile(
        path.join(_idDir, imageName.after)
      );
      uploaded.after = true;
    }
    if (uploaded.before === true || uploaded.after === true) {
      new Error('Failed to store files');
    }
    return imageName;
  } catch (err) {
    console.error(err);
  }
};

//@Util
//Get the file from the path
export const attachImageToJob = async (job) => {
  // Console.debug("dettached => "+job)
  if (!getImageLocation()) {
    console.error('FILE STORE empty');
    throw Error('Something went wrong');
  }
  if (job === undefined) {
    throw new Error('job is undefined');
  }

  const location = path.join(getImageLocation(), job._id.toString()),
    bbuff = await fs
      .readFile(path.join(location, job.proofOfWork.before))
      .catch((err) => console.error(err)),
    abuff = await fs
      .readFile(path.join(location, job.proofOfWork.after))
      .catch((err) => console.error(err));
  job.proofOfWork = {
    before: bbuff.toString('base64'),
    after: abuff.toString('base64'),
  };
  return job;
};

//@Util
//@Input: Fromdata.Array<File>
//Get the file from the path
export const saveImageFromJobTodo = async (_id, files) => {
  if (!getImageLocation()) {
    console.error('FILE STORE empty');
    throw new Error('Something went wrong');
  }
  if (!_id) {
    throw new Error('job id is undefined');
  }
  if (!files) {
    throw new Error('Proof of work is required');
  }
  const defaultExt = '.jpg',
    imageName = {
      current: `current${defaultExt}`,
    },
    uploaded = { current: false };
  try {
    const _idDir = path.join(getImageLocation(), _id.toString());
    await fs.mkdir(_idDir.toString(), { recursive: true });
    if (files.current) {
      const buff =
        (files?.current?.path
          ? await fs.readFile(path.join(files.current.path))
          : files.current) ?? files.current;
      await fs.writeFile(path.join(_idDir, imageName.current), buff, {
        flag: 'w',
      });
      uploaded.current = true;
    }
    if (uploaded.current === false) {
      console.error('failed to store files');
      throw new Error('Failed to store files');
    }
    return { current: imageName.current };
  } catch (err) {
    console.error(err);
    throw new Error('Something went wrong!');
  }
};

//@Util
//@Input : Job
//Get the file from the path
export const attachImageToJobTodo = async (jobTodo) => {
  // Console.debug("dettached => "+job)
  if (!getImageLocation()) {
    console.error('FILE STORE empty');
    throw Error('Something went wrong');
  }
  if (jobTodo === undefined) {
    throw new Error('job todo is undefined');
  }

  const location = path.join(getImageLocation(), jobTodo._id.toString()),
    bbuff = await fs
      .readFile(path.join(location, jobTodo.current))
      .catch((err) => console.error(err));
  jobTodo.current = bbuff.toString('base64');
  return jobTodo;
};

export const getImageLocation = () => path.resolve(process.env.FILE_STORE);
