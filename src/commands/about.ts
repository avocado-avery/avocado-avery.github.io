import command from "../../config.json" assert { type: "json" };

const createAbout = (): string[] => {
  const about: string[] = [];

  const SPACE = "&nbsp;";
  const COLUMN_WIDTH = 17;

  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";
  const HTB = "HackTheBox";

  const email = `<i class='fa-solid fa-envelope'></i> ${EMAIL}`;
  const github = `<i class='fa-brands fa-github'></i> ${GITHUB}`;
  const linkedin = `<i class='fa-brands fa-linkedin'></i> ${LINKEDIN}`;
  const htb = `<i class='fa-solid fa-terminal'></i> ${HTB}`;

  let string = "";

  about.push("<br>");
  about.push(command.aboutGreeting);
  about.push("<br>");

  // Email
  string = "";
  string += SPACE.repeat(2);
  string += email;
  string += SPACE.repeat(COLUMN_WIDTH - EMAIL.length);
  string += `<a target='_blank' href='mailto:${command.social.email}'>${command.social.email}</a>`;
  about.push(string);

  // Github
  string = "";
  string += SPACE.repeat(2);
  string += github;
  string += SPACE.repeat(COLUMN_WIDTH - GITHUB.length);
  string += `<a target='_blank' href='https://github.com/${command.social.github}'>github/${command.social.github}</a>`;
  about.push(string);

  // Linkedin
  string = "";
  string += SPACE.repeat(2);
  string += linkedin;
  string += SPACE.repeat(COLUMN_WIDTH - LINKEDIN.length);
  string += `<a target='_blank' href='https://www.linkedin.com/in/${command.social.linkedin}'>linkedin/${command.social.linkedin}</a>`;
  about.push(string);

  // HackTheBox
  string = "";
  string += SPACE.repeat(2);
  string += htb;
  string += SPACE.repeat(COLUMN_WIDTH - HTB.length);
  string += `<a target='_blank' href='https://app.hackthebox.com/users/${command.social.hackthebox}'>HackTheBox/${command.social.hackthebox}</a>`;
  about.push(string);

  about.push("<br>");
  return about;
};

export const ABOUT = createAbout();
