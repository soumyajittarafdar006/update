import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function run() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir });

  console.log('Staging project files...');
  const files = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'index.html',
    'README.md',
    '.gitignore',
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/types/index.ts',
    'src/data/seedData.ts',
    'src/context/AppContext.tsx',
    'src/components/Navbar.tsx',
    'src/components/Sidebar.tsx',
    'src/components/MemberSwitchModal.tsx',
    'src/components/NotificationDrawer.tsx',
    'src/components/TaskModal.tsx',
    'src/components/UpdateProgressModal.tsx',
    'src/components/DailyLogModal.tsx',
    'src/pages/DashboardPage.tsx',
    'src/pages/WeeklySchedulePage.tsx',
    'src/pages/TodaysWorkPage.tsx',
    'src/pages/MemberWorkspacePage.tsx',
    'src/pages/DailyWorkLogPage.tsx',
    'src/pages/TeamPage.tsx',
    'src/pages/ProjectRoadmapPage.tsx',
    'src/pages/WeeklyReviewPage.tsx',
    'src/pages/NotificationsPage.tsx',
    'src/pages/SettingsPage.tsx',
    'server/server.ts'
  ];

  for (const file of files) {
    if (fs.existsSync(path.join(dir, file))) {
      await git.add({ fs, dir, filepath: file });
      console.log(`Staged: ${file}`);
    }
  }

  console.log('Committing changes...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Soumyajit Tarafdar',
      email: 'soumyajittarafdar006@gmail.com'
    },
    message: 'CanSat V1 Team Work Management Application with Express Backend & 10-Week Schedule'
  });

  console.log(`Commit SUCCESS! SHA: ${sha}`);
}

run().catch(console.error);
