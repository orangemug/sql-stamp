INSERT INTO users values(1, 'bob',  "admin",    "active");
INSERT INTO users values(2, 'emma', "admin",    "disabled");
INSERT INTO users values(3, 'leo',  "readonly", "active");
INSERT INTO users values(4, 'jane', "admin",    "active");

INSERT INTO friends(id, fromId, toId) VALUES(1, 1, 2);
INSERT INTO friends(id, fromId, toId) VALUES(2, 2, 3);
INSERT INTO friends(id, fromId, toId) VALUES(3, 3, 4);
