/*
 Navicat MySQL Dump SQL

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80036 (8.0.36)
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80036 (8.0.36)
 File Encoding         : 65001

 Date: 01/08/2024 13:44:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `question_id` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `create_time` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of answer
-- ----------------------------
INSERT INTO `answer` VALUES (3, 'Stock buybacks involve companies repurchasing their own shares, which can increase shareholder value.\r\n', NULL, 14, 0, '2024-07-29 19:32:28.628000');
INSERT INTO `answer` VALUES (4, 'Stock exchanges provide platforms where stocks, bonds, and other securities are bought and sold by investors.\r\n', NULL, 13, 0, '2024-07-29 19:35:29.228000');
INSERT INTO `answer` VALUES (5, 'Margin trading involves borrowing funds from a broker to buy stocks, amplifying potential gains or losses.\r\n', NULL, 12, 0, '2024-07-29 19:35:38.325000');
INSERT INTO `answer` VALUES (6, 'Blue-chip stocks refer to shares of well-established, financially stable companies with a history of reliable performance.\r\n', NULL, 11, 0, '2024-07-29 19:35:46.601000');
INSERT INTO `answer` VALUES (7, 'A bear market indicates a prolonged period of declining stock prices, often reflecting negative investor sentiment.\r\n', NULL, 10, 0, '2024-07-29 19:35:56.484000');
INSERT INTO `answer` VALUES (8, 'Dividends are cash payments from companies to shareholders, rewarding them for holding their stock.\r\n', NULL, 9, 0, '2024-07-29 19:36:04.401000');
INSERT INTO `answer` VALUES (9, 'A stock split increases the number of outstanding shares while decreasing the share price proportionally.\r\n', NULL, 8, 0, '2024-07-29 19:36:13.883000');
INSERT INTO `answer` VALUES (10, 'P/E ratio (Price-to-Earnings ratio) shows how much investors are willing to pay per dollar of earnings.\r\n', NULL, 7, 0, '2024-07-29 19:36:22.473000');
INSERT INTO `answer` VALUES (11, 'Stocks represent ownership stakes in companies, while bonds are debt instruments that companies issue.\r\n', NULL, 6, 0, '2024-07-29 19:36:32.868000');
INSERT INTO `answer` VALUES (12, 'A stock represents ownership in a company, providing shareholders with rights to company profits and assets.\r\n', NULL, 5, 0, '2024-07-29 19:36:42.029000');
INSERT INTO `answer` VALUES (13, 'abc', NULL, 14, 0, '2024-07-31 14:06:35.781000');

-- ----------------------------
-- Table structure for friend_link
-- ----------------------------
DROP TABLE IF EXISTS `friend_link`;
CREATE TABLE `friend_link`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend_link
-- ----------------------------
INSERT INTO `friend_link` VALUES (1, 'Google', 'http://www.google.com', 'https://www.google.com/logos/doodles/2024/paris-games-artistic-gymnastics-6753651837110525-law.gif');
INSERT INTO `friend_link` VALUES (2, 'Youtube', 'https://www.youtube.com', 'https://www.google.com/logos/doodles/2024/paris-games-artistic-gymnastics-6753651837110525-law.gif');

-- ----------------------------
-- Table structure for invest_term
-- ----------------------------
DROP TABLE IF EXISTS `invest_term`;
CREATE TABLE `invest_term`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `definition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of invest_term
-- ----------------------------

-- ----------------------------
-- Table structure for mkt_sim_param
-- ----------------------------
DROP TABLE IF EXISTS `mkt_sim_param`;
CREATE TABLE `mkt_sim_param`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `a1pvrlwr_bd` int NOT NULL,
  `a1pvrupr_bd` int NOT NULL,
  `a1tccap` int NOT NULL,
  `a1tvlwr_bd` int NOT NULL,
  `a1tvupr_bd` int NOT NULL,
  `a2pvrlwr_bd` int NOT NULL,
  `a2pvrupr_bd` int NOT NULL,
  `a2tccap` int NOT NULL,
  `a2tvlwr_bd` int NOT NULL,
  `a2tvupr_bd` int NOT NULL,
  `a3pvrlwr_bd` int NOT NULL,
  `a3pvrupr_bd` int NOT NULL,
  `a3tccap` int NOT NULL,
  `a3tvlwr_bd` int NOT NULL,
  `a3tvupr_bd` int NOT NULL,
  `param_created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `param_date_created` datetime(6) NULL DEFAULT NULL,
  `param_date_effective` date NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mkt_sim_param
-- ----------------------------

-- ----------------------------
-- Table structure for portfolio
-- ----------------------------
DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE `portfolio`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `v$` double NOT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK76ws6sj6wg26k7lcx6a5mtqi4`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK76ws6sj6wg26k7lcx6a5mtqi4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio
-- ----------------------------

-- ----------------------------
-- Table structure for portfolio_stock
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_stock`;
CREATE TABLE `portfolio_stock`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `purchased_price` float NOT NULL,
  `quantity` bigint NOT NULL,
  `portfolio_id` bigint NULL DEFAULT NULL,
  `stock_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK7x1vm1n2o0sho0korvsx8jw1c`(`portfolio_id` ASC) USING BTREE,
  INDEX `FKpicvf1k8jf05cr389u0mopc9w`(`stock_id` ASC) USING BTREE,
  CONSTRAINT `FK7x1vm1n2o0sho0korvsx8jw1c` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolio` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKpicvf1k8jf05cr389u0mopc9w` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio_stock
-- ----------------------------

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `create_time` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of question
-- ----------------------------
INSERT INTO `question` VALUES (5, 'What is a stock?	', NULL, 0, '2024-07-29 19:31:32.436000');
INSERT INTO `question` VALUES (6, 'How do stocks differ from bonds?	', NULL, 0, '2024-07-29 19:31:40.860000');
INSERT INTO `question` VALUES (7, 'What does P/E ratio indicate?	', NULL, 0, '2024-07-29 19:31:44.859000');
INSERT INTO `question` VALUES (8, 'What happens during a stock split?	', NULL, 0, '2024-07-29 19:31:49.371000');
INSERT INTO `question` VALUES (9, 'How do dividends benefit shareholders?	', NULL, 0, '2024-07-29 19:31:53.669000');
INSERT INTO `question` VALUES (10, 'What is the significance of a bear market?	', NULL, 0, '2024-07-29 19:31:57.777000');
INSERT INTO `question` VALUES (11, 'What are blue-chip stocks?	', NULL, 0, '2024-07-29 19:32:04.028000');
INSERT INTO `question` VALUES (12, 'How does margin trading work?	', NULL, 0, '2024-07-29 19:32:08.435000');
INSERT INTO `question` VALUES (13, 'What is the role of stock exchanges?	', NULL, 0, '2024-07-29 19:32:12.828000');
INSERT INTO `question` VALUES (14, 'What is the purpose of stock buybacks?	', NULL, 0, '2024-07-29 19:32:16.897000');

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ipoyear` int NOT NULL,
  `a_class` tinyint NULL DEFAULT NULL,
  `currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `last_trade_price` double NOT NULL,
  `open_price` double NOT NULL,
  `stock_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stock_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  CONSTRAINT `stock_chk_1` CHECK (`a_class` between 0 and 2)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of stock
-- ----------------------------

-- ----------------------------
-- Table structure for stock_trade
-- ----------------------------
DROP TABLE IF EXISTS `stock_trade`;
CREATE TABLE `stock_trade`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_traded` date NULL DEFAULT NULL,
  `price` double NOT NULL,
  `status` tinyint NULL DEFAULT NULL,
  `time_traded` time(6) NULL DEFAULT NULL,
  `volume` bigint NOT NULL,
  `stock_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKn5hsuo5ecpjbrvtm07ygpd23x`(`stock_id` ASC) USING BTREE,
  CONSTRAINT `FKn5hsuo5ecpjbrvtm07ygpd23x` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `stock_trade_chk_1` CHECK (`status` between 0 and 3)
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of stock_trade
-- ----------------------------

-- ----------------------------
-- Table structure for terminology
-- ----------------------------
DROP TABLE IF EXISTS `terminology`;
CREATE TABLE `terminology`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `term` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `definition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  FULLTEXT INDEX `term_index`(`definition`)
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of terminology
-- ----------------------------
INSERT INTO `terminology` VALUES (1, 'Stock', 'Security representing ownership in a company, giving shareholders rights and benefits.\n');
INSERT INTO `terminology` VALUES (2, 'Limit Up', 'When a stock price rises by the maximum allowed limit in a trading day, halting trading.\n');
INSERT INTO `terminology` VALUES (3, 'Limit Down', 'When a stock price falls by the maximum allowed limit in a trading day, halting trading.');
INSERT INTO `terminology` VALUES (4, 'P/E Ratio', 'Price-to-Earnings ratio, the ratio of a company\'s market price per share to its earnings per share.');
INSERT INTO `terminology` VALUES (5, 'Index', 'Indicator measuring market performance, usually calculated as a weighted average of stock prices.');
INSERT INTO `terminology` VALUES (6, 'Closing Price', 'The last traded price of a stock at the end of a trading session.');
INSERT INTO `terminology` VALUES (7, 'Opening Price', 'The first traded price of a stock at the beginning of a trading session.');
INSERT INTO `terminology` VALUES (8, 'Gain', 'The increase in a stock\'s price over a certain period, expressed in percentage or points.');
INSERT INTO `terminology` VALUES (9, 'Decline', 'The decrease in a stock\'s price over a certain period, expressed in percentage or points.');
INSERT INTO `terminology` VALUES (10, 'Dividend', 'Payment made by a company to its shareholders as a share of its profits.');
INSERT INTO `terminology` VALUES (11, 'Listing', 'Admission of a company\'s stock to official trading on a stock exchange.');
INSERT INTO `terminology` VALUES (12, 'Volume', 'Total number of shares traded over a specific period.');
INSERT INTO `terminology` VALUES (13, 'Shareholder', 'Individual or entity owning shares in a company.');
INSERT INTO `terminology` VALUES (14, 'Main Capital', 'Large funds manipulating markets, often influencing stock price movements.');
INSERT INTO `terminology` VALUES (15, 'Margin Trading', 'Practice of buying stocks with borrowed money to increase potential returns.');
INSERT INTO `terminology` VALUES (16, 'Restricted Shares', 'Shares held under certain restrictions that limit their sale for a period.');
INSERT INTO `terminology` VALUES (17, 'Stock Split', 'Corporate action increasing the number of outstanding shares while reducing the share price.');
INSERT INTO `terminology` VALUES (18, 'Stock Buyback', 'Repurchase of company\'s own stock from the open market.\n');
INSERT INTO `terminology` VALUES (19, 'Market Order', 'Order to buy or sell a stock at the current market price immediately.');
INSERT INTO `terminology` VALUES (20, 'Limit Order', 'Order to buy or sell a stock at a specified price or better.');
INSERT INTO `terminology` VALUES (21, 'Bear Market', 'Prolonged period of falling stock prices and negative investor sentiment.');
INSERT INTO `terminology` VALUES (22, 'Bull Market', 'Prolonged period of rising stock prices and positive investor sentiment.');
INSERT INTO `terminology` VALUES (23, 'Options', 'Contracts allowing the purchase or sale of stocks without obligation.');
INSERT INTO `terminology` VALUES (24, 'Strike Price', 'Predetermined price at which an option contract allows buying or selling of the stock.');
INSERT INTO `terminology` VALUES (25, 'Cash Dividend', 'Dividend paid to shareholders in cash.');
INSERT INTO `terminology` VALUES (26, 'Bonus Issue', 'Free issue of additional shares to existing shareholders based on current holdings.');
INSERT INTO `terminology` VALUES (27, 'Rights Issue', 'Issuance of new shares to existing shareholders with rights to purchase at a specific price.');
INSERT INTO `terminology` VALUES (28, 'Capital Stock', 'Total shares issued by a company including common and preferred stock.');
INSERT INTO `terminology` VALUES (29, 'Preferred Stock', 'Type of stock that typically pays a fixed dividend and has priority over common stock in dividends.');
INSERT INTO `terminology` VALUES (30, 'Shareholder Equity', 'Value of assets available to shareholders after deducting liabilities.');
INSERT INTO `terminology` VALUES (31, 'NASDAQ', 'American electronic stock exchange focusing on technology companies.');
INSERT INTO `terminology` VALUES (32, 'Trading Day', 'Day when trading of securities occurs on a stock exchange.');
INSERT INTO `terminology` VALUES (33, 'Stock Exchange', 'Marketplace where securities are traded publicly, e.g., NYSE, NASDAQ.');
INSERT INTO `terminology` VALUES (34, 'Online Trading', 'Buying and selling securities via the internet.');
INSERT INTO `terminology` VALUES (35, 'Price Limit', 'Maximum allowable price change for a stock within a trading day.');
INSERT INTO `terminology` VALUES (36, 'Corporate Governance', 'System of rules and practices governing a company\'s management and accountability to shareholders.');
INSERT INTO `terminology` VALUES (37, 'Earnings Report', 'Report detailing a company\'s financial performance over a specific period.');
INSERT INTO `terminology` VALUES (38, 'Profit', 'Total income minus total expenses for a specific period.');
INSERT INTO `terminology` VALUES (39, 'Stock Manipulation', 'Illegal practice of artificially inflating or deflating stock prices.');
INSERT INTO `terminology` VALUES (40, 'Stock Futures', 'Contracts to buy or sell stocks at a set price on a future date.');
INSERT INTO `terminology` VALUES (41, 'Investment Portfolio', 'Collection of assets such as stocks, bonds, and real estate owned by an investor or institution.');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` tinyint NULL DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  CONSTRAINT `users_chk_1` CHECK (`role` between 0 and 1)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
